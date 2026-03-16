# MotoLogbook – Requirements Document

A minimalist personal web app for tracking maintenance and modifications of a single motorbike.
Platform: Web (Svelte 5 + Tailwind CSS + TypeScript, Firebase backend, static hosting).

---

## 1. Project Overview

MotoLogbook is a simple log for one bike.
It has two main screens:

- Home: list of all log entries with filters and a "New log" modal.
- Settings: bike information + data backup.

No dashboard, no analytics, no multi-bike support.

Goals:

- Minimal UI; focus on quickly adding and browsing logs.
- Cloud data storage via Firestore with offline-first persistence.
- Secure access via Google authentication.
- Hosted on Firebase Hosting.

---

## 2. High-Level Features

1. Google sign-in authentication.
2. Single-bike configuration (Settings).
3. Log entries list (Home).
4. New log entry form/modal.
5. Log entry detail view with remove option.
6. Simple filters on the list.
7. Image attachment upload per log entry.
8. Cloud storage via Firestore with offline persistence.

---

## 3. Functional Requirements

### 3.1 Authentication

- Sign in with Google via Firebase Authentication.
- App is fully gated behind authentication — unauthenticated users see a login screen.
- Sign-out button in the top navigation bar.
- Firestore and Storage rules require `request.auth != null`.

---

### 3.2 Home Page (Log List)

Route: `/`

**Header area**

- Show bike name (from Settings) or "Your bike" placeholder if not set.
- Subtitle: "Maintenance & modification log".
- "New log entry" button (visible on desktop; on mobile the `+` button in the bottom nav opens the same modal).

**Log list**

- Display all log entries in reverse chronological order (newest first).
- Each card shows:
  - Type badge (color-coded).
  - Date.
  - Title.
  - Odometer (if set).
  - Cost (if set).
  - Paperclip icon if an attachment is present.
- Clicking a card navigates to the log detail page.

**Filters**

- Type filter: pill buttons — All, Maintenance, Modification, Repair, Fuel, Inspection, Cleaning, Other.
- Date filter: from and to date inputs.
- Filters update the list immediately.

**Empty states**

- No logs yet: friendly message + "New log entry" button.
- No matching logs: "No matching logs" message.

---

### 3.3 New Log Entry (Modal)

**Trigger**

- "New log entry" button on Home (desktop).
- `+` button in bottom navigation bar (mobile).

**Fields**

- Date (date input, default today) — required.
- Type (select: Maintenance, Modification, Repair, Fuel, Inspection, Cleaning, Other) — required.
- Title (text) — required.
- Odometer (number, km, optional).
- Cost (number, ฿, optional).
- Notes (textarea, optional).
- Attachment (image file upload, optional — images only, max 10 MB).

**Behavior**

- Validate required fields (Date, Type, Title); show inline error messages.
- On Save:
  - Upload image to Firebase Storage if provided.
  - Write entry to Firestore with `created_at` timestamp.
  - Close modal and reset form.
- On Cancel: close without saving.
- Show thumbnail preview after image is selected.
- Show upload error message if save fails.

---

### 3.4 Log Detail Page

Route: `/log/:id`

- Back button to return to Home.
- Type badge and date.
- "Saved on" datetime (`created_at`).
- Title.
- Odometer and cost stats (if set).
- Notes (if set).
- Image attachment thumbnail (if set), links to full image in new tab.
- Two-step remove button: click "Remove" → confirm "Confirm" or "Cancel".

---

### 3.5 Settings Page

Route: `/settings`

**Bike information section**

Fields:

- Bike name (required).
- Brand.
- Model.
- Year.
- Color.
- Engine type (ICE / EV / Hybrid).
- License plate.
- VIN.
- Current odometer (km).
- Buying date.

Behavior:

- Load current values from Firestore on app init.
- "Save" button updates bike info in Firestore.
- Show "Saved successfully" confirmation on save.

**Data & backup section**

- "Export data" button (UI present; not yet implemented).
- "Import data" button (UI present; not yet implemented).
- Helper text explaining data is stored in the cloud via Firestore.

---

## 4. Non-functional Requirements

### 4.1 Minimalist UX

- Two nav items: Home and Settings.
- No charts, no extra cards.
- Dark navy theme, clean typography.
- Max content width: 720px.
- Responsive layout:
  - Desktop (sm+): top navigation bar with sign-out button.
  - Mobile: bottom navigation bar with Home, `+` (new log), and Settings icons.

### 4.2 Data Storage

- Firestore as the primary database with `persistentLocalCache` for offline-first behavior.
- Firebase Storage for image attachments.
- Data is scoped to the authenticated user.

### 4.3 Security

- Firebase Auth gates all app access.
- Firestore rules: read/write only if `request.auth != null`.
- Storage rules: read/write only if `request.auth != null`.
- Security headers via Firebase Hosting: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Static assets cached with `Cache-Control: immutable`.
- Image uploads limited to 10 MB.

### 4.4 Performance

- Firebase bundle split into a separate chunk to reduce initial JS size.
- Images loaded lazily in detail view.
- App shell loads quickly as a static web app.

---

## 5. Tech Stack

- **Svelte 5** + TypeScript + Vite 7
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Firebase**: Firestore, Storage, Authentication, Hosting
- `lucide-svelte` for icons
- No UI component library — plain HTML + Tailwind classes

---

## 6. Data Model (Firestore)

### 6.1 bike (document: `bikes/{userId}`)

| Field              | Type             | Notes                      |
|--------------------|------------------|----------------------------|
| `name`             | string           | Required                   |
| `brand`            | string           |                            |
| `model`            | string           |                            |
| `year`             | number \| null   |                            |
| `color`            | string           |                            |
| `engine_type`      | string           | `ICE` \| `EV` \| `Hybrid` |
| `plate_number`     | string           |                            |
| `vin`              | string           |                            |
| `current_odometer` | number \| null   | km                         |
| `buying_date`      | string \| null   | ISO date string            |

### 6.2 log_entry (collection: `logs/{userId}/entries`)

| Field            | Type            | Notes                                                                       |
|------------------|-----------------|-----------------------------------------------------------------------------|
| `id`             | string          | Firestore document ID                                                       |
| `date`           | string          | ISO date string (user-selected)                                             |
| `created_at`     | string          | ISO datetime, stamped at save time                                          |
| `odometer`       | number \| null  | km                                                                          |
| `type`           | string          | maintenance / modification / repair / fuel / inspection / cleaning / other  |
| `title`          | string          |                                                                             |
| `description`    | string \| null  |                                                                             |
| `cost`           | number \| null  | ฿                                                                           |
| `attachment_url` | string \| null  | Firebase Storage download URL                                               |

---

## 7. UI Structure

- **App.svelte**: auth guard → loading spinner → Login page or main app.
- **Layout.svelte**: wraps all authenticated pages; renders top nav (desktop), bottom nav (mobile), and `NewLogModal`.
- **Home.svelte**: filters + log list.
- **LogDetail.svelte**: single entry detail + remove.
- **Settings.svelte**: bike form + backup section.
- **Login.svelte**: Google sign-in button.

---

## 8. Routing

Simple history-based SPA router (no SvelteKit, no SSR):

| Path        | Component  |
|-------------|------------|
| `/`         | Home       |
| `/log/:id`  | LogDetail  |
| `/settings` | Settings   |

Firebase Hosting rewrites all paths to `/index.html`.

---

## 9. Firebase Emulators (Local Development)

| Emulator  | Port |
|-----------|------|
| Auth      | 9099 |
| Firestore | 8080 |
| Storage   | 9199 |
| Hosting   | 1073 |
| UI        | 4000 |

---

## 10. Future Considerations

- Export / import data.
- Edit existing log entries.
- PWA support (manifest + service worker for installability).
- Multi-bike support.
