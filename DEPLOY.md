# LeetLens Deployment Guide

Deploy the **dashboard** to Vercel and the **backend** (Firebase) for auth, Firestore, and email reminders.

---

## Part 1 — Firebase Backend

### 1. Login & deploy Firestore rules

```powershell
cd leetcode-extension-main
npx firebase-tools login
npx firebase deploy --only firestore:rules --project automation-of-electricity
```

### 2. Deploy Cloud Functions (10 AM email reminders)

```powershell
cd functions
npm install
npm run build
cd ..
npx firebase deploy --only functions --project automation-of-electricity
```

### 3. Set email secrets (Resend)

```powershell
npx firebase-tools functions:secrets:set RESEND_API_KEY --project automation-of-electricity
npx firebase-tools functions:secrets:set EMAIL_FROM --project automation-of-electricity
```

Use `EMAIL_FROM` like: `LeetLens <noreply@yourdomain.com>` (domain must be verified in Resend).

### 4. Firebase Console checklist

- **Authentication** → Enable Google + Email/Password
- **Authentication** → Authorized domains → add your Vercel domain (e.g. `leetlens.vercel.app`)
- **Authentication** → Google provider → use the same Web Client ID as in `.env`

### 5. Google Cloud OAuth (for web dashboard)

In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Credentials → OAuth 2.0 Client:

Add **Authorized JavaScript origins**:
- `https://YOUR-VERCEL-DOMAIN.vercel.app`

Add **Authorized redirect URIs**:
- `https://YOUR-VERCEL-DOMAIN.vercel.app/`

For the Chrome extension, also keep:
- `https://EXTENSION_ID.chromiumapp.org/`

---

## Part 2 — Vercel Dashboard

### 1. Prepare locally

```powershell
npm install
npm run build
npm run build:css
npm run prepare:web
```

This creates a `web/` folder with the dashboard + a Chrome API shim for browsers.

### 2. Push to GitHub

Commit and push the repo (or connect your existing repo).

### 3. Import in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `leetcode-extension-main` (inner folder if monorepo)
4. Framework: **Other**
5. Build settings are read from `vercel.json` automatically

### 4. Environment variables (Vercel → Settings → Environment Variables)

Copy from your `.env`:

| Variable | Example |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `automation-of-electricity.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `automation-of-electricity` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `automation-of-electricity.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `...` |
| `VITE_FIREBASE_APP_ID` | `...` |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | `....apps.googleusercontent.com` |

> Re-run deploy after adding env vars so `npm run build` embeds them in `lib/dashboard-bundle.js`.

### 5. Deploy

Click **Deploy**. Your dashboard will be live at `https://your-project.vercel.app/dashboard.html`.

---

## Part 3 — Chrome Extension (local tracking)

The extension still provides **LeetCode sidebar tracking**. Load unpacked from `leetcode-extension-main` after `npm run build`.

1. `chrome://extensions` → Developer mode → Load unpacked
2. Add `chrome-extension://YOUR_EXTENSION_ID` to Firebase Authorized domains
3. Add `https://YOUR_EXTENSION_ID.chromiumapp.org/` to Google OAuth redirect URIs

---

## What works where

| Feature | Extension | Web Dashboard |
|---------|-----------|---------------|
| Time tracking on LeetCode | ✅ | ❌ |
| Cloud sign-in & sync | ✅ | ✅ |
| LeetCode / GitHub sync | ✅ | ✅ |
| Analytics & weekly goals | ✅ | ✅ |
| Problems list (local + LC) | ✅ | Partial (localStorage only on web) |
| Email reminders (10 AM) | ✅ | ✅ |

---

## Troubleshooting

**"Missing or insufficient permissions"** when linking LeetCode/GitHub  
→ Deploy Firestore rules (Part 1, step 1).

**Google sign-in fails on Vercel**  
→ Add Vercel URL to Firebase authorized domains and Google OAuth redirect URIs.

**Emails not sending**  
→ Check Resend API key, verified sender domain, and Firebase Functions logs:
```powershell
npx firebase functions:log --project automation-of-electricity
```

**Build fails on Vercel**  
→ Ensure Node 18+ and all `VITE_*` env vars are set before deploy.

**404 / MIME type errors for `lib/dashboard-*.js` or CSS on Vercel**  
→ The `lib/` dashboard source files must be committed to git (only `lib/dashboard-bundle.js` and `lib/background-bundle.js` are build artifacts and stay gitignored). After pulling the latest `.gitignore`, run:
```powershell
git add lib/*.js lib/*.css chrome-shim.js
git commit -m "Track dashboard lib sources for Vercel deploy"
git push
```
Then redeploy on Vercel. The build runs `npm run prepare:web`, which copies `lib/` into `web/lib/` for hosting.
