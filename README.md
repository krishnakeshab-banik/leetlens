<<<<<<< HEAD
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
=======
﻿# LeetCode Time Tracker

A powerful Chrome extension that automatically tracks your coding practice on LeetCode with intelligent time analytics, personal ratings, and comprehensive statistics.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 1. Automatic Time Tracking
- **Real-time tracking** of your time spent on each LeetCode problem
- **Live timer** in the extension popup showing current session duration
- **Multi-session support** to capture your complete practice history
- **Millisecond precision** with human-readable time formatting (e.g., "2h 45m", "3m 20s")

### 2. Personal Rating System
- Rate each problem on a **1-5 star scale** to track difficulty, relevance, or personal assessment
- Store subjective assessments alongside objective metrics
- Quick-access ratings from the popup for active problems

### 3. Comprehensive Dashboard
- **Aggregate statistics**: Total problems, total time invested, session counts
- **Per-difficulty breakdown**: Statistics for Easy, Medium, and Hard problems
- **Problem table** with sortable columns:
  - Problem title and difficulty level (color-coded badges)
  - Total time investment
  - Star ratings
  - Submission status
  - First seen and last seen timestamps
- **Dark theme** optimized for extended coding sessions

### 4. Smart Problem Detection
- Auto-detects problem metadata (title, difficulty, unique identifier)
- Captures problem submission events to mark completed problems
- Maintains comprehensive history of your problem encounters
- Robust parsing for various LeetCode page layouts

### 5. Quick Access
- Press **Ctrl+Shift+L** to instantly open the full dashboard
- Convenient popup interface for quick reference
- Seamless integration with the Chrome browser

---

## Installation

### Prerequisites
- Google Chrome browser (version 88 or later)
- Basic understanding of Chrome extensions

### Step-by-Step Installation

#### Option 1: Install from Repository (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnakeshab-banik/leetcode_timetracker.git
   cd leetcode_timetracker
   ```

2. **Open Chrome Extensions Page**
   - Open Chrome and navigate to: `chrome://extensions/`
   - OR: Menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle the **"Developer mode"** switch in the top-right corner

4. **Load the Extension**
   - Click **"Load unpacked"** button
   - Navigate to and select the `extension/` folder from the cloned repository
   - Click **"Select Folder"**

5. **Verify Installation**
   - The extension icon should appear in your Chrome toolbar
   - You'll see "LeetCode Time Tracker" in your extensions list

#### Option 2: Manual Installation

1. Download the repository as a ZIP file
2. Extract the ZIP file to your desired location
3. Follow steps 2-5 from Option 1 above

---

## Usage

### Basic Workflow

1. **Navigate to LeetCode**
   - Go to any LeetCode problem page (e.g., https://leetcode.com/problems/two-sum/)
   - The extension automatically starts tracking your session

2. **View Current Session Stats**
   - Click the extension icon in your Chrome toolbar
   - See real-time timer, problem difficulty, and rating options
   - Rate the problem using the 1-5 star system

3. **Access Full Dashboard**
   - Press **Ctrl+Shift+L** on your keyboard
   - OR click the "Dashboard" button in the extension popup
   - View comprehensive statistics and your complete problem history

4. **Track Your Progress**
   - Time is automatically saved when you leave the problem
   - Visit the dashboard to see your practice patterns
   - Use statistics to identify areas for improvement

### Dashboard Features

- **View all tracked problems** with total time spent
- **Filter by difficulty** to see where you spend most time
- **Check star ratings** you assigned to each problem
- **See first/last seen dates** for each problem
- **View session counts** for recurring problems

### Data Storage

All your data is stored locally in your browser using Chrome's `storage.local` API. Your data:
- 1. Never leaves your computer
- 2. Is never sent to external servers
- 3. Persists across browser restarts
- 4. Is specific to your browser profile

---

## Project Structure

```
leetcode-tracker-extension/
├── extension/
│   ├── manifest.json              # Chrome extension configuration
│   ├── background.js              # Service worker (session management)
│   ├── content.js                 # Content script (LeetCode page detection)
│   ├── popup.html                 # Extension popup UI
│   ├── popup.js                   # Popup interaction logic
│   ├── dashboard.html             # Full dashboard page
│   ├── dashboard.js               # Dashboard logic & visualization
│   └── icons/                     # Extension icons
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── README.md                      # This file
└── .gitignore                     # Git ignore rules
```

### File Descriptions

| File | Purpose |
|------|---------|
| `manifest.json` | Defines extension metadata, permissions, and entry points |
| `background.js` | Manages session tracking, data persistence, and inter-script communication |
| `content.js` | Injects into LeetCode pages to detect problem metadata and changes |
| `popup.html` | UI for the extension popup (380px width) |
| `popup.js` | Handles popup interactions, live timer, and star ratings |
| `dashboard.html` | Full-page dashboard for comprehensive statistics |
| `dashboard.js` | Data visualization and dashboard functionality |

---

## Development Setup

### Prerequisites
- Node.js and npm (optional, for building/testing)
- A text editor (VS Code recommended)
- Chrome browser

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnakeshab-banik/leetcode_timetracker.git
   cd leetcode_timetracker
   ```

2. **Load in Chrome (Developer Mode)**
   - Follow the installation steps above
   - Enable "Developer mode" for hot-reloading

3. **Make Changes**
   - Edit files in the `extension/` directory
   - Changes to popup and dashboard take effect immediately
   - For background.js changes, reload the extension:
     - Go to `chrome://extensions/`
     - Click the refresh icon on the extension card

4. **Test Your Changes**
   - Navigate to a LeetCode problem page
   - Verify tracking starts automatically
   - Check popup for real-time timer
   - Open dashboard to verify data display

### Building for Production

No build process required! This extension runs directly without compilation. All code is plain JavaScript with no dependencies.

---

## Technical Details

### Technologies Used
- **Chrome Extension API v3** (Manifest V3)
- **Vanilla JavaScript** (ES6+)
- **HTML5 & CSS3**
- **Chrome Storage API** for local data persistence

### Browser Compatibility
- Chrome 88+
- Edge 88+ (Chromium-based)

### Permissions Required
- `storage` - Save user tracking data locally
- `tabs` - Monitor active tabs
- `alarms` - Schedule periodic tasks
- Host permission for `https://leetcode.com/*`

### Data Structure

Problems are stored with the following structure:
```javascript
{
  slug: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  totalMs: 1800000,              // Total milliseconds spent
  sessions: 3,                    // Number of practice sessions
  stars: 4,                       // User rating (1-5)
  solved: true,                   // Submission status
  openedTabs: [],                // Browser tab tracking
  firstSeen: 1686320400000,      // Timestamp
  lastSeen: 1686320400000        // Timestamp
}
```

---

## Troubleshooting

### Extension Not Working

**Problem**: Timer not starting on LeetCode problems
- **Solution**: Ensure you're on a LeetCode problem page (URL contains `/problems/`)
- **Check**: Go to `chrome://extensions/`, find LeetCode Time Tracker, and verify it's enabled

**Problem**: Dashboard shows no data
- **Solution**: Make sure you've spent time on at least one LeetCode problem
- **Check**: Click the extension icon - the popup should show "No active problem" or current session data

**Problem**: Data not persisting
- **Solution**: Check if Chrome's local storage is enabled
- **Check**: Try accessing `chrome://settings/cookies` and ensure storage is allowed

**Problem**: Keyboard shortcut (Ctrl+Shift+L) not working
- **Solution**: 
  1. Go to `chrome://extensions/shortcuts`
  2. Find "Open LeetCode Tracker Dashboard"
  3. Set or reset your preferred keyboard shortcut

### Resetting All Data

To clear all tracked problems and start fresh:
1. Right-click the extension icon → "Manage extension"
2. Click "Storage" or "Details"
3. Under "Local data storage", click "Manage"
4. Click "Remove all" or clear the storage
5. Refresh any open LeetCode problem pages

---

## Contributing

Contributions are welcome! Help us improve the LeetCode Time Tracker.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them thoroughly
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: description of your feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** with a detailed description

### Guidelines
- Test on multiple LeetCode problem pages
- Maintain the existing code style
- Update this README if adding new features
- Keep commits focused and atomic

### Ideas for Contributions
- Export data to CSV/JSON
- Problem difficulty heatmap
- Weekly/monthly statistics
- Comparison charts
- Dark/light theme toggle
- Support for other coding practice platforms

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## Roadmap

Future features being considered:

- [ ] Export statistics to CSV
- [ ] Weekly/monthly activity charts
- [ ] Problem difficulty heatmap
- [ ] Sync data across devices
- [ ] Integration with LeetCode API for submission verification
- [ ] Achievement badges
- [ ] Study streak tracker
- [ ] Analytics graphs and charts

---

## Support

### Getting Help

- **Found a bug?** Open an [issue on GitHub](https://github.com/krishnakeshab-banik/leetcode_timetracker/issues)
- **Have a feature idea?** Suggest it in the issues section
- **Need help?** Check the [Troubleshooting](#troubleshooting) section

### Reporting Issues

When reporting issues, please include:
- Chrome version (Settings → About Chrome)
- Extension version (shown in `chrome://extensions/`)
- Steps to reproduce the issue
- Screenshots if applicable
- Whether data is syncing properly

---

## Acknowledgments

- Built with Chrome Extension API v3
- Inspired by the need to track coding practice efficiently
- Thanks to all contributors and users!

---

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [LeetCode](https://leetcode.com/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

---
>>>>>>> 21cdf6dbdb891f48cf54c27f24d37cc4c95e8daa
