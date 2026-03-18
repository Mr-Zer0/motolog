# Changelog

## v1.1.0

**Released:** 2026-03-18

### Features

- **Edit log entries** — Tap any log entry to edit its details in-place
- **PWA support** — Installable as a home screen app with offline service worker
- **Infinite scroll** — Log list loads more entries as you scroll down
- **Manual sync** — Settings page shows last sync time and a "Sync now" button to pull fresh data from the server on demand
- **Custom file upload** — Attachment field replaced with a styled upload zone

### Improvements

- **Cache-first loading** — App reads from IndexedDB on every open (zero network reads after first load)
- **60-day initial load** — Initial fetch retrieves the last 60 days of entries instead of a fixed item count
- **Cache-first load more** — Older entries are served from local cache when available, falling back to network
- **Sign-out clears sync state** — Last sync timestamp is reset on sign-out so the next session always gets fresh data
- **Shared log form** — New and edit flows share a single `LogForm` component

---

## v1.0.0 — Initial Release

**Released:** 2026-03-16

Motolog is a minimalist personal web app for tracking maintenance, repairs, and modifications of a single motorbike.

### Features

- **Log entries** — Add and browse log entries with type, date, odometer, cost, and notes
- **Log types** — Maintenance, Modification, Repair, Fuel, Inspection, Cleaning, Other
- **Log detail** — View full details of any log entry with option to remove
- **Image attachments** — Attach a photo to any log entry (stored in Firebase Storage)
- **Filters** — Filter logs by type and date range on the home screen
- **Bike profile** — Save your bike's name, brand, model, year, plate number, VIN, odometer, and purchase date in Settings
- **Google sign-in** — Secure access via Google Authentication
- **Offline-first** — Data persists locally via Firestore's persistent cache
- **Responsive UI** — Bottom navigation on mobile, top navigation on desktop
- **Dark navy theme** — Clean, minimal dark UI

### Tech Stack

- Svelte 5 + TypeScript + Vite
- Tailwind CSS v4
- Firebase (Firestore, Storage, Auth, Hosting)
