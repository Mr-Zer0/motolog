# Changelog

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
