# LeetCode Time Tracker

A lightweight, offline-first Chrome extension that sits in your LeetCode sidebar and tracks exactly how long you spend on each problem. 

No signups, no external databases, and no page refreshes needed.

## Features

- **Automatic Session Tracking**: Timer starts as soon as you open a problem and pauses/saves when you leave the tab or navigate away.
- **LeetCode Sidebar**: Injected directly into the LeetCode problem layout so you can see your live timer, rate difficulty/quality, and mark progress without breaking your flow.
- **Auto-Detects "Accepted"**: Watches the page using DOM mutation observers. The moment you get an "Accepted" submission, the sidebar status updates to Solved instantly.
- **Analytical Dashboard**: Access a full overview of your stats by pressing `Ctrl + Shift + L`. Filter by difficulty, sort by time spent, and see where you're getting stuck.
- **100% Private**: Your data never leaves your browser. It uses Chrome's `storage.local` API.

---

## Installation (Local / Developer Mode)

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the `extension` folder inside this repository.

---

## Keyboard Shortcuts

- **`Ctrl + Shift + L`**: Instantly open the dashboard page.

---

## File Structure

- `manifest.json`: Configuration, V3 permissions, and host permissions for LeetCode.
- `background.js`: Service worker managing active session state, saving records, and broadcasting storage events to open tabs/dashboard.
- `content.js`: Injected script that extracts metadata (problem name, difficulty) and monitors submission status.
- `sidebar.js` / `sidebar.css`: Injects and styles the persistent side panel on the LeetCode problems page.
- `popup.html` / `popup.js`: Quick status dropdown when clicking the extension icon.
- `dashboard.html` / `dashboard.js`: The full metrics dashboard page.

---

## License

MIT
