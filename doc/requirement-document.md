# MotoLogbook – Minimal Requirements Document

A minimalist personal web app for tracking maintenance and modifications of a single motorbike.  
Platform: Web (React + Tailwind + shadcn, SQLite WASM in browser, static hosting).

---

## 1. Project Overview

MotoLogbook is a simple, local-only log for one bike.  
It has just two main screens:

- Home: list of all log entries with filters and a “New log” form/modal.
- Settings: bike information + data backup.

No dashboard, no analytics, no multi-bike support.

Goals:

- Zero backend and zero recurring cost.
- Minimal UI; focus on quickly adding and browsing logs.
- All data local in browser, with optional manual backup.

---

## 2. High-Level Features

1. Single-bike configuration (Settings).
2. Log entries list (Home).
3. New log entry form/modal.
4. Simple filters on the list.
5. Local storage via SQLite WASM.
6. Manual export/import (even if basic).

---

## 3. Functional Requirements

### 3.1 Home Page (Log List)

Route: `/`  

**Header area**

- Show bike name (from Settings) or a placeholder like “Your bike” if not set.
- A brief subtitle (e.g., “Maintenance & modification log”).
- Primary button: “New log entry”.

**Log list**

- Display all log entries in reverse chronological order (newest first).
- Use a table or list with these columns/fields:
  - Date.
  - Type (badge: maintenance, modification, repair, fuel, other).
  - Title.
  - Odometer.
  - Cost.
  - Attachment indicator (icon if `hasAttachment` is true).

**Filters (simple)**

- Type filter:
  - Dropdown or pill selector: All, Maintenance, Modification, Repair, Fuel, Other.
- Date filter:
  - Optional: from and to date inputs.
- When filters change, list updates immediately.

**Empty states**

- When there are no logs:
  - Show a friendly message (“No logs yet”) and a prominent “New log entry” button.

---

### 3.2 New Log Entry (Modal or Inline Form)

**Trigger**

- “New log entry” button on Home.

**Fields**

- Date (date input, default to today).
- Odometer (number).
- Type (select: maintenance, modification, repair, fuel, other).
- Title (text).
- Description/notes (textarea).
- Cost (number).
- Has attachment (checkbox; boolean only).

**Behavior**

- Validate required fields: Date, Type, Title.
- On Save:
  - Insert new row into SQLite.
  - Close modal / reset form.
  - Refresh log list.
- On Cancel:
  - Close without changes.

Optional v1+: edit/delete existing log entries.

---

### 3.3 Settings Page

Route: `/settings`  

**Bike information section**

Fields:

- Bike name (required).
- Brand.
- Model.
- Year.
- License plate.
- VIN.
- Current odometer.

Behavior:

- Display current values from the `bike` table (single row).
- “Save” button:
  - Updates the bike info in DB.
- Show a small confirmation message on successful save.

**Data & backup section**

- Button: “Export data”
  - v1: triggers a download of a SQLite DB file or JSON export (can be implemented later; UI exists now).
- Button: “Import data”
  - v1: allows selecting a file; for now can just log that file was selected, or replace DB once implemented.
- Helper text:
  - Explain that all data is stored locally in the browser.
  - Suggest periodically exporting for backup.

---

## 4. Non-functional Requirements

### 4.1 Minimalist UX

- Only two nav items: Home and Settings.
- No charts, no extra cards.
- Navy dark theme, clean typography.
- Focus on:
  - Fast “add log” flow.
  - Readable list.

### 4.2 Local-Only Data

- SQLite via WASM in browser.
- Persist DB file to IndexedDB or OPFS so data survives reloads and restarts.
- No external backend, no sync.

---

## 5. Tech Stack

- React + TypeScript.
- Tailwind CSS.
- shadcn/ui.
- SQLite WASM (e.g., sql.js or official sqlite3 WASM).
- Static hosting (Firebase Hosting, Netlify, etc.).

---

## 6. Data Model (SQLite)

### 6.1 bike

- id (integer primary key, default 1).
- name (text).
- brand (text).
- model (text).
- year (integer).
- plate_number (text).
- vin (text).
- current_odometer (integer).

### 6.2 log_entry

- id (integer primary key autoincrement).
- date (text, ISO string).
- odometer (integer, nullable).
- type (text; maintenance / modification / repair / fuel / other).
- title (text).
- description (text, nullable).
- cost (real, nullable).
- has_attachment (integer, 0/1).

---

## 7. UI Structure

- Layout:
  - Left sidebar (or top nav) with:
    - Home
    - Settings
- Main content:
  - Home: filters + log list + New log button.
  - Settings: bike form + backup section.

---

## 8. Implementation Phases

1. Layout & mock data:
   - Build Home and Settings with in-memory arrays.
2. SQLite integration:
   - Wire Home and Settings to SQLite DB.
3. Persistence:
   - Save DB to IndexedDB/OPFS.
4. Backup/import:
   - Implement export/import.
5. Polish:
   - Add edit/delete, better validation, small UX improvements.

---
