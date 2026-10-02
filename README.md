# GATE Streak

A Chrome extension (Manifest V3) for daily GATE DA study tracking: checklist, streaks, rest days and a 12-week heatmap.

## Features
- **Daily checklist:** customizable tasks (core study, PYQs, programming, revision). Add or remove tasks from the popup.
- **Streak tracking:** a day counts only when every task is completed. An unfinished current day is pending, not broken.
- **Rest-day token:** one per week. It keeps the streak alive without adding to it.
- **Heatmap:** last 12 weeks, shaded by daily completion.
- **Toolbar badge:** current streak shown on the extension icon.
- **Evening reminder:** a notification around 8 pm if today's checklist isn't done (while Chrome is open).

## Install
1. Clone or download this repo and extract it.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Pin the extension from the puzzle-piece menu.

## Tech
- JavaScript, HTML, CSS (no frameworks or dependencies)
- Chrome APIs: `storage`, `alarms`, `notifications`, service worker background script
- All data is stored locally in `chrome.storage.local`; nothing leaves the browser.

## Project structure
| File | Purpose |
|---|---|
| `manifest.json` | Extension config |
| `popup.html/css/js` | Checklist, streak and heatmap UI |
| `shared.js` | Date helpers and streak logic |
| `background.js` | Badge updates and reminder alarm |

## Streak rules
- Full day: streak +1
- Rest day: streak kept, nothing added (max one per Monday-Sunday week)
- Missed day: streak resets to 0
- Longest streak is tracked separately

## Roadmap
- Load a 90-day GATE DA roadmap as per-day tasks
- Mock-test score log with topic-wise accuracy
- Score prediction from accuracy trends<img width="396" height="206" alt="Screenshot 2026-10-02 183109" src="https://github.com/user-attachments/assets/1c48b1d0-9c77-46a4-85b1-02fe31f0c7cc" />
<img width="481" height="625" alt="Screenshot 2026-10-02 182540" src="https://github.com/user-attachments/assets/809dd0e2-f62b-4111-a4ca-43c0c7887b15" />
