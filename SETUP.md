# LeetLens Setup Guide

Complete setup for Firebase Authentication, Firestore, LeetCode sync, and Resend email reminders.

## Prerequisites

- Node.js 20+
- Google Chrome
- Firebase project (`automation-of-electricity` or your own)
- Resend account with verified sender domain
- Firebase CLI: `npm install -g firebase-tools`

---

## 1. Firebase Setup

### Enable services

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project `automation-of-electricity`
3. **Authentication** → Sign-in method → Enable **Google**
4. **Firestore Database** → Create database (production mode)
5. Deploy rules and indexes:

```bash
firebase login
firebase use automation-of-electricity
firebase deploy --only firestore:rules,firestore:indexes
```

### Google Sign-In (Web Application OAuth — no Chrome Store required)

Chrome Extension OAuth clients often require Chrome Web Store publication. **Use a Web Application client instead** with `chrome.identity.launchWebAuthFlow`.

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → your project
2. Use existing **Web application** OAuth 2.0 Client ID (or create one)
3. Load the unpacked extension in Chrome → copy **Extension ID** from `chrome://extensions`
4. Open Dashboard → **Sign In** — copy the **Authorized redirect URI** shown on the page
   - Format: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
5. In Google Cloud Console → Web client → **Authorized redirect URIs** → add that exact URI
6. Add client ID to `.env` (client secret is NOT needed in the extension):

```
VITE_GOOGLE_OAUTH_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
```

7. Rebuild and reload:

```bash
npm run build
```

**Never** put the OAuth client secret in the extension or `.env` — it is not used for this flow.

---

## 2. Extension Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_CHROME_OAUTH_CLIENT_ID=...
```

Build bundles:

```bash
npm install
npm run build
```

Load the extension in Chrome:

1. `chrome://extensions` → Developer mode → Load unpacked
2. Select the `leetcode-extension-main` folder

---

## 3. Resend Setup (Email Reminders)

Emails are sent **only from Cloud Functions** — never from the extension.

### Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain (or use onboarding domain for testing)
3. Create API key

### Firebase Secrets

```bash
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set EMAIL_FROM
```

- `RESEND_API_KEY`: your Resend API key (`re_...`)
- `EMAIL_FROM`: verified sender, e.g. `LeetLens <srm.insider.club@gmail.com>`

### Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

The scheduled function `sendDailyReminders` runs every 15 minutes and sends emails at each user's `reminderTime` (default **10:00 IST**).

---

## 4. Firestore Schema

```
users/{uid}
  uid, email, displayName, photoURL, createdAt, lastLoginAt
  leetcodeUsername
  emailRemindersEnabled, reminderTime, timezone

users/{uid}/stats/current
  totalSolved, easySolved, mediumSolved, hardSolved, streak
  submissionCalendar, recentSubmissions, acceptanceStats, syncedAt

users/{uid}/dailySnapshots/{YYYY-MM-DD}
  date, totalSolved, easySolved, mediumSolved, hardSolved, streak

users/{uid}/solvedProblems/{problemId}
  problemId, title, difficulty, solvedAt, timeSpentMinutes
  userDifficultyRating, tags, source

users/{uid}/activity/{activityId}
  problemId, startedAt, endedAt, timeSpentMinutes, result

users/{uid}/weeklyPlans/{weekId}
  weekId, startDate, endDate, targetProblems, completedProblems, status
```

---

## 5. Chrome Extension Permissions

Added permissions (see `manifest.json`):

| Permission | Purpose |
|------------|---------|
| `storage` | Local + auth state |
| `tabs` | Dashboard, broadcasts |
| `alarms` | Service worker heartbeat |
| `identity` | Google Sign-In via `chrome.identity` |

Host permissions: `leetcode.com`, Firebase/Google APIs.

---

## 6. Feature Overview

| Feature | Status |
|---------|--------|
| Local time tracking | Preserved (unchanged) |
| Google Sign-In | Dashboard auth panel |
| LeetCode linking | Username validation + Firestore |
| Profile sync | GraphQL → stats, calendar, submissions |
| Solved problems DB | `users/{uid}/solvedProblems` |
| Activity tracking | Per-session `activity` collection |
| Personal difficulty rating | Modal after solve (1–5 stars) |
| Striver A2Z | Full sheet from `data/striver-a2z.json` |
| Weekly planning | `weeklyPlans` collection |
| Email reminders | Cloud Function + Resend |
| Dashboard widgets | Heatmap, goals, A2Z, analytics |

---

## 7. Development Commands

```bash
npm install          # Install deps
npm run build        # Bundle Firebase for extension
npm run build:css    # Rebuild Tailwind (optional)
firebase deploy      # Deploy rules + functions
```

---

## 8. Troubleshooting

**Sign-in fails**
- Verify `VITE_CHROME_OAUTH_CLIENT_ID` matches Chrome Extension OAuth client
- Extension ID must match the OAuth client configuration

**Sync fails**
- Link LeetCode username first
- LeetCode GraphQL is public; no auth cookie required for profile stats

**Emails not sent**
- Check `emailRemindersEnabled` on user doc
- Verify secrets: `firebase functions:secrets:access RESEND_API_KEY`
- Function logs: `firebase functions:log`

**Cloud bundle missing**
- Run `npm run build` before loading extension
- `lib/dashboard-bundle.js` and `lib/background-bundle.js` must exist

---

## Security Notes

- Never commit `.env` or Resend API keys
- Resend keys live only in Firebase Secret Manager
- Firestore rules restrict all user data to `request.auth.uid`
