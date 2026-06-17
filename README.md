# LeetLens

**Track smarter. Revise better. Sync everywhere.**

LeetLens is a LeetCode productivity platform built by students at SRM IST. It combines a **Chrome extension** for live problem tracking with a **cloud-connected analytics dashboard** for progress, planning, and revision.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Web-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [What Is LeetLens?](#what-is-leetlens)
- [Features](#features)
- [Quick Start](#quick-start)
- [Install the Chrome Extension](#install-the-chrome-extension)
- [Environment Variables](#environment-variables)
- [Development Setup](#development-setup)
- [Dashboard Guide](#dashboard-guide)
- [Extension vs Web Dashboard](#extension-vs-web-dashboard)
- [Deploying to Production](#deploying-to-production)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

---

## What Is LeetLens?

LeetLens helps you practice LeetCode more deliberately:

1. **On LeetCode** — A sidebar timer tracks how long you spend on each problem, detects Accepted submissions, and lets you rate difficulty.
2. **In the Dashboard** — View analytics, heatmaps, weekly goals, Striver A2Z progress, spaced revision, and synced LeetCode/GitHub stats.
3. **In the Cloud** — Sign in with Google or email to back up progress, sync solved problems across devices, and receive daily email reminders.

> **Built by the students, built for the students.**

---

## Features

### Chrome Extension (Desktop)

| Feature | Description |
|--------|-------------|
| **Automatic timer** | Starts when you open a problem; pauses when you leave |
| **LeetCode sidebar** | Live timer, star ratings, and solved status inside the problem page |
| **Accepted detection** | DOM observer updates status when you get Accepted |
| **Offline-first** | Data stored locally in `chrome.storage.local` |
| **Keyboard shortcut** | `Ctrl + Shift + L` opens the dashboard |

### Analytics Dashboard

| Section | Description |
|--------|-------------|
| **Overview** | Practice stats, activity heatmap, account sync status |
| **Problems** | All solved problems — extension-tracked + LeetCode API merge |
| **Revise** | Spaced repetition calendar (R1–R4 schedule) |
| **Striver A2Z** | Full Striver sheet with auto-progress from solves |
| **Weekly Plan** | Set and track weekly problem goals |
| **Analytics** | Difficulty breakdown, trends, recent activity |
| **GitHub Sync** | Link GitHub, view repos, stars, languages |
| **Profile** | Account, LeetCode/GitHub linking, email reminders |
| **Extension** | Install status & Chrome Web Store link *(desktop only)* |
| **Developers** | Meet the team behind LeetLens |

### Cloud & Backend

| Feature | Description |
|--------|-------------|
| **Firebase Auth** | Google Sign-In + email/password |
| **Firestore sync** | Profile, stats, solved problems, activity |
| **LeetCode sync** | Import all solved problems via LeetCode GraphQL API |
| **GitHub sync** | Public repos, stars, followers, languages |
| **Email reminders** | Daily 10:00 AM IST nudge via Firebase Functions + Resend |

---

## Quick Start

### Option A — Extension only (no cloud)

Best if you only want local time tracking on LeetCode.

```bash
git clone https://github.com/arihantjain6739/leetcode-extension.git
cd leetcode-extension/leetcode-extension-main
npm install
npm run build
```

Then load the folder in Chrome → `chrome://extensions` → **Developer mode** → **Load unpacked**.

### Option B — Full platform (extension + cloud dashboard)

1. Complete **Option A** above.
2. Create a `.env` file (see [Environment Variables](#environment-variables)).
3. Run `npm run build` again so Firebase config is embedded.
4. Deploy Firebase + Vercel (see [Deploying to Production](#deploying-to-production) or `DEPLOY.md`).

---

## Install the Chrome Extension

### Prerequisites

- Google Chrome, Brave, or Edge (Chromium 109+)
- **Desktop only** — the extension cannot run on phones or tablets

### Steps

1. **Clone and build**
   ```bash
   git clone https://github.com/arihantjain6739/leetcode-extension.git
   cd leetcode-extension/leetcode-extension-main
   npm install
   npm run build
   npm run build:css
   ```

2. **Load in Chrome**
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `leetcode-extension-main` folder (the one containing `manifest.json`)

3. **Verify**
   - Visit any LeetCode problem page (e.g. `leetcode.com/problems/two-sum/`)
   - The LeetLens sidebar should appear
   - Press `Ctrl + Shift + L` to open the dashboard

### Chrome Web Store

Published extension ID: `hahacfpglcbjeflkpolohnacmoadeopi`

Install link (also shown in the dashboard Extension tab):
https://chromewebstore.google.com/detail/hahacfpglcbjeflkpolohnacmoadeopi

### After code changes

| What changed | What to do |
|--------------|------------|
| `popup.html`, `dashboard.html`, `sidebar.js`, etc. | Reload the extension page or refresh the tab |
| `background.js`, `manifest.json`, `npm run build` output | Click **Reload** on `chrome://extensions` |
| `.env` or Firebase config | Run `npm run build`, then reload the extension |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Firebase (from Firebase Console → Project settings)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Google OAuth — Web Application client ID (not the client secret)
VITE_GOOGLE_OAUTH_CLIENT_ID=your_id.apps.googleusercontent.com
```

These are compiled into `lib/dashboard-bundle.js` at build time. **Never commit `.env`** — it is gitignored.

For Vercel, set the same `VITE_*` variables in **Project → Settings → Environment Variables**, then redeploy.

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm
- Chrome (for extension testing)

### Scripts

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run build` | Bundle Firebase/cloud code → `lib/dashboard-bundle.js`, `lib/background-bundle.js` |
| `npm run build:css` | Compile Tailwind → `tailwind.css` |
| `npm run prepare:web` | Generate `web/` folder for Vercel deployment |

### Typical dev workflow

```bash
# 1. Install
npm install

# 2. Configure cloud (optional)
cp .env.example .env
# Edit .env with your Firebase + OAuth credentials

# 3. Build
npm run build
npm run build:css

# 4. Load extension in Chrome (see Install section)

# 5. For web dashboard preview
npm run prepare:web
# Serve web/ with any static server, or deploy to Vercel
```

### Important notes

- **`lib/dashboard-bundle.js` and `lib/background-bundle.js`** are build outputs and gitignored.
- **All other `lib/*.js` and `lib/*.css` files** must be committed — Vercel needs them during `prepare:web`.
- Open the dashboard via the extension (`Ctrl + Shift + L`) for full Chrome API integration.
- The web dashboard uses `chrome-shim.js` and falls back to `localStorage` for local problem data.

---

## Dashboard Guide

Open the dashboard with **`Ctrl + Shift + L`** or from the extension popup.

### Navigation

| Tab | What it does |
|-----|--------------|
| **Overview** | Stats, heatmap, account sync summary |
| **Problems** | Searchable table of all solved/tracked problems |
| **Revise** | Spaced repetition schedule and calendar |
| **Sign In / Profile** | Cloud account and linked services |
| **Striver A2Z** | Striver DSA sheet progress |
| **Plan** | Weekly goal setting |
| **Analytics** | Charts, KPIs, difficulty distribution |
| **GitHub Sync** | GitHub profile and repo analytics |
| **Extension** | Extension install/status *(hidden on mobile)* |
| **Developers** | Team info and links |

### Recommended first-time flow

1. **Sign in** (Google or email) → you land on **Profile**
2. **Link LeetCode username** → click **Sync Profile** to import all solved problems
3. **Link GitHub username** → click **Sync GitHub**
4. Visit **Overview** for heatmap and stats
5. Use **Problems** to browse merged local + LeetCode data

Once both accounts are linked and synced, Overview shows a compact **Accounts Connected** card instead of sync inputs.

### Mobile

The dashboard is responsive on phones and tablets. The **Extension** tab is desktop-only (Chrome extensions do not run on mobile).

---

## Extension vs Web Dashboard

| Feature | Chrome Extension | Web Dashboard (Vercel) |
|---------|:----------------:|:----------------------:|
| Per-problem timer on LeetCode | ✅ | ❌ |
| Local time tracking | ✅ | Partial (localStorage shim) |
| Cloud sign-in & sync | ✅ | ✅ |
| LeetCode profile sync | ✅ | ✅ |
| GitHub sync | ✅ | ✅ |
| Analytics & heatmap | ✅ | ✅ |
| Striver A2Z & weekly plan | ✅ | ✅ |
| Spaced revision | ✅ | ✅ |
| Email reminders (10 AM IST) | ✅ | ✅ |
| Extension install page | ✅ | ✅ (desktop only) |

---

## Deploying to Production

LeetLens has two deployable parts:

1. **Web dashboard** → Vercel (static `web/` output)
2. **Backend** → Firebase (Auth, Firestore, Cloud Functions)

### Web dashboard (Vercel)

`vercel.json` is preconfigured:

```json
{
  "buildCommand": "npm run build && npm run build:css && npm run prepare:web",
  "outputDirectory": "web"
}
```

**Checklist:**

1. Commit all `lib/*.js` source files (not the two bundle outputs)
2. Push to GitHub
3. Import repo in Vercel — set root directory to `leetcode-extension-main`
4. Add all `VITE_*` environment variables
5. Deploy → live at `https://your-project.vercel.app/dashboard.html`

The `api/` folder provides serverless proxies for LeetCode GraphQL and GitHub API (required for browser CORS on the web dashboard).

### Firebase backend

```bash
# Firestore security rules
npx firebase deploy --only firestore:rules

# Email reminder functions
cd functions && npm install && npm run build && cd ..
npx firebase deploy --only functions
```

**Firebase Console setup:**

- Enable **Google** + **Email/Password** authentication
- Add authorized domains: your Vercel URL, `chrome-extension://YOUR_EXTENSION_ID`
- Google OAuth redirect URIs: Vercel URL + `https://EXTENSION_ID.chromiumapp.org/`

For the complete step-by-step guide (OAuth, Resend email secrets, troubleshooting), see **[DEPLOY.md](./DEPLOY.md)**.

---

## Project Structure

```
leetcode-extension-main/
├── api/                      # Vercel serverless proxies (LeetCode, GitHub CORS)
├── assets/developers/        # Team photos
├── chrome-shim.js            # Chrome API shim for web dashboard
├── data/
│   └── striver-a2z.json      # Striver A2Z sheet data
├── functions/                # Firebase Cloud Functions (email reminders)
├── icons/                    # Extension icons
├── lib/                      # Dashboard UI modules + built bundles
│   ├── dashboard-*.js        # Feature modules (analytics, github, etc.)
│   ├── dashboard-bundle.js   # Built — Firebase/cloud (gitignored)
│   └── background-bundle.js  # Built — background worker bundle (gitignored)
├── scripts/
│   ├── build.js              # esbuild bundler
│   └── prepare-web.js        # Generates web/ for Vercel
├── src/
│   ├── dashboard-bundle.js   # Cloud module entry
│   ├── leetcode-api.js       # LeetCode GraphQL client
│   ├── github-api.js         # GitHub API client
│   └── ...
├── web/                      # Generated deploy output (from prepare:web)
├── background.js             # Extension service worker
├── content.js                # LeetCode page detection
├── sidebar.js / sidebar.css  # In-page sidebar UI
├── popup.html / popup.js     # Extension popup
├── dashboard.html / dashboard.js
├── manifest.json
├── firebase.json
├── firestore.rules
├── vercel.json
├── DEPLOY.md                 # Detailed deployment guide
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Extension | Chrome Manifest V3, vanilla JS |
| Dashboard UI | HTML, Tailwind CSS, vanilla JS |
| Cloud | Firebase Auth, Firestore |
| Build | esbuild, Tailwind CSS |
| APIs | LeetCode GraphQL, GitHub REST |
| Email | Firebase Functions, Resend |
| Hosting | Vercel (dashboard), Firebase (backend) |

### Data stored locally (extension)

```javascript
{
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  totalMs: 1800000,
  sessions: 3,
  stars: 4,
  solved: true,
  firstSeen: 1686320400000,
  lastSeen: 1686320400000
}
```

---

## Troubleshooting

### Extension

| Problem | Fix |
|---------|-----|
| Timer not starting | Ensure URL contains `/problems/` and extension is enabled |
| Dashboard empty | Spend time on at least one problem, then reload dashboard |
| `Ctrl + Shift + L` not working | Set shortcut at `chrome://extensions/shortcuts` |
| Cloud sign-in fails | Run `npm run build` with `.env` filled; reload extension |
| Changes not appearing | Reload extension at `chrome://extensions` after `npm run build` |

### Dashboard / Cloud

| Problem | Fix |
|---------|-----|
| LeetCode link fails with "Failed to fetch" (web) | Redeploy Vercel so `api/leetcode.js` is live |
| GitHub link fails (web) | Ensure `api/github.js` is deployed |
| "Missing or insufficient permissions" | Deploy Firestore rules: `npx firebase deploy --only firestore:rules` |
| Google sign-in fails on Vercel | Add Vercel domain to Firebase authorized domains + OAuth redirect URIs |
| 404 for `lib/dashboard-*.js` on Vercel | Commit `lib/*.js` sources to git (see DEPLOY.md) |
| Emails not sending | Check Resend API key and Firebase Functions logs |

### Reset local data

Use the trash icon in the dashboard header, or clear storage at `chrome://extensions` → LeetLens → Storage.

---

## Team

LeetLens is developed by students at **SRM University of Science and Technology, Kattankulathur**.

| Developer | GitHub |
|-----------|--------|
| Arihant Jain | [@arihantjain6739](https://github.com/arihantjain6739) |
| Krishna Keshab Banik | [@krishnakeshab-banik](https://github.com/krishnakeshab-banik) |

Also check out **[SRM Insider](https://srminsider.in)** — campus news and resources from the same community.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and test on LeetCode + dashboard
4. Run `npm run build` if you touched `src/` or `.env`
5. Open a pull request with a clear description

Please keep commits focused and match the existing code style.

---

## License

MIT License — free to use, modify, and distribute with attribution.

---

## Links

- [Repository](https://github.com/arihantjain6739/leetcode-extension)
- [Chrome Web Store](https://chromewebstore.google.com/detail/hahacfpglcbjeflkpolohnacmoadeopi)
- [Deployment Guide](./DEPLOY.md)
- [LeetCode](https://leetcode.com/)
- [SRM Insider](https://srminsider.in)
