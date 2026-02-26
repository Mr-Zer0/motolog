# Motorbike Maintenance Tracker - Requirements Document

**Project Name:** Motorbike Maintenance Tracker  
**Version:** 1.0  
**Date:** February 26, 2026  
**Author:** Yan Naing  
**Location:** Bangkok, Thailand

## Executive Summary

This document outlines the requirements for a personal web-based motorbike maintenance tracking application. The system allows a single user to log all maintenance activities, modifications, and costs associated with their motorcycle without requiring a backend server or recurring costs. The application runs entirely in the browser using modern web technologies and stores all data locally on the user's device.

## Project Overview

### Purpose

To create a zero-cost, offline-capable web application that enables tracking of motorcycle maintenance history, modifications, and associated expenses for personal use.

### Scope

The application will support:

\begin{itemize}
\item Logging maintenance activities (oil changes, filter replacements, etc.)
\item Recording modifications and upgrades (headlight changes, exhaust upgrades, etc.)
\item Tracking costs for parts and labor
\item Storing receipt photos and documentation
\item Viewing maintenance history and statistics
\item Exporting and importing data for backup purposes
\end{itemize}

### Out of Scope (Version 1.0)

\begin{itemize}
\item Multi-user support
\item Cloud synchronization across devices
\item Automated maintenance reminders
\item Integration with external services or APIs
\item Mobile native applications
\end{itemize}

## Stakeholders

**Primary User:** Yan Naing - motorcycle owner who wants to track all maintenance and modification activities with associated costs.

## System Architecture

### Technology Stack

\begin{table}
\begin{tabular}{|l|l|l|}
\hline
Component & Technology & Justification \\
\hline
Frontend Framework & React & Modern, component-based UI development \\
UI Components & shadcn/ui & Consistent, accessible component library \\
Database & SQLite + WASM & Local-first, no backend required \\
Storage & OPFS/IndexedDB & Browser-native file and data persistence \\
Hosting & Firebase Hosting & Free tier for static sites \\
\hline
\end{tabular}
\caption{Technology stack components}
\end{table}

### Architecture Principles

\begin{enumerate}
\item \textbf{Local-First}: All data stored on user's device, no server dependency
\item \textbf{Zero Cost}: No recurring hosting or database costs
\item \textbf{Privacy}: User data never leaves their device
\item \textbf{Offline-Capable}: Works without internet connection after initial load
\item \textbf{Export/Import}: User controls their data with backup capabilities
\end{enumerate}

## Functional Requirements

### FR-1: Motorcycle Profile Management

**FR-1.1: Add Motorcycle**  
Users can create a motorcycle profile with the following information:

\begin{itemize}
\item Motorcycle name/nickname (required)
\item Brand (required)
\item Model (required)
\item Year (optional)
\item License plate number (optional)
\item VIN (Vehicle Identification Number) (optional)
\item Current odometer reading in kilometers (required)
\item Purchase date (optional)
\item Purchase price (optional)
\item Photo (optional)
\end{itemize}

**FR-1.2: Edit Motorcycle**  
Users can update any motorcycle profile information.

**FR-1.3: View Motorcycle Details**  
Users can view complete motorcycle profile including summary statistics (total maintenance cost, last service date, total modifications, etc.).

**FR-1.4: Delete Motorcycle**  
Users can delete a motorcycle profile (with confirmation dialog to prevent accidental deletion).

**FR-1.5: Multiple Motorcycles**  
System supports tracking multiple motorcycles (for future use).

### FR-2: Maintenance and Modification Logging

**FR-2.1: Log Event**  
Users can create a new maintenance or modification event with the following information:

\begin{itemize}
\item Date (required, defaults to today)
\item Odometer reading at time of service (required)
\item Event type (required): Maintenance, Modification, Repair, Inspection, Other
\item Title/Name (required): e.g., "Engine Oil Change", "Headlight Upgrade to LED"
\item Description (optional): Free text for additional details
\item Cost - Parts (optional)
\item Cost - Labor (optional)
\item Cost - Total (optional, auto-calculated if parts and labor provided)
\item Shop/Technician name (optional)
\item Invoice/Receipt number (optional)
\item Attachments (optional): Photos of receipts, parts, or completed work
\item Notes (optional): Additional observations or recommendations
\end{itemize}

**FR-2.2: Edit Event**  
Users can update any logged event information.

**FR-2.3: Delete Event**  
Users can delete an event (with confirmation).

**FR-2.4: View Event Details**  
Users can view complete information for a specific event including all attachments.

### FR-3: History and Reporting

**FR-3.1: Event Timeline**  
Display all events in reverse chronological order (most recent first) with:

\begin{itemize}
\item Date and odometer reading
\item Event type badge/icon
\item Title and brief description
\item Total cost
\item Quick action buttons (view, edit, delete)
\end{itemize}

**FR-3.2: Filter Events**  
Users can filter events by:

\begin{itemize}
\item Event type (Maintenance, Modification, Repair, etc.)
\item Date range
\item Cost range
\item Search by title or description
\end{itemize}

**FR-3.3: Event History by Type**  
View all events of a specific type (e.g., all oil changes, all modifications).

**FR-3.4: Cost Summary**  
Display total costs with breakdowns:

\begin{itemize}
\item Total spent (all time)
\item Spent by event type
\item Spent by time period (monthly, yearly)
\item Cost per kilometer
\end{itemize}

**FR-3.5: Maintenance Statistics**  
Display useful statistics:

\begin{itemize}
\item Last maintenance date and odometer
\item Total events logged
\item Most frequent maintenance types
\item Average cost per event
\end{itemize}

### FR-4: File Attachments

**FR-4.1: Upload Attachments**  
Users can attach files (images, PDFs) to events:

\begin{itemize}
\item Supported formats: JPEG, PNG, PDF
\item Maximum file size: 5 MB per file
\item Multiple files per event (up to 10)
\end{itemize}

**FR-4.2: View Attachments**  
Users can view attached images and PDFs in the browser.

**FR-4.3: Delete Attachments**  
Users can remove individual attachments from events.

**FR-4.4: Local Storage**  
All attachments stored in browser using OPFS or IndexedDB.

### FR-5: Data Management

**FR-5.1: Export Data**  
Users can export all data (database + attachments) as:

\begin{itemize}
\item Single backup file (ZIP containing SQLite DB and attachments folder)
\item JSON format (for portability)
\item CSV format (for spreadsheet analysis)
\end{itemize}

**FR-5.2: Import Data**  
Users can import previously exported backup files to restore data.

**FR-5.3: Clear All Data**  
Users can delete all data from the application (with strong confirmation warning).

### FR-6: User Interface

**FR-6.1: Responsive Design**  
Application works on desktop, tablet, and mobile browsers with appropriate layout adjustments.

**FR-6.2: Dashboard/Home Screen**  
Landing page displays:

\begin{itemize}
\item Quick stats (total cost, recent events)
\item Motorcycle selector (if multiple bikes)
\item Quick action: Log new event
\item Recent event timeline (last 5-10 events)
\end{itemize}

**FR-6.3: Navigation**  
Clear navigation structure:

\begin{itemize}
\item Dashboard
\item Events (full history)
\item Motorcycles (profile management)
\item Statistics
\item Settings/Export
\end{itemize}

**FR-6.4: Forms**  
All forms include:

\begin{itemize}
\item Clear labels and validation
\item Required field indicators
\item Input validation with helpful error messages
\item Save and cancel actions
\end{itemize}

## Non-Functional Requirements

### NFR-1: Performance

\begin{itemize}
\item Initial page load: under 3 seconds on 4G connection
\item Event list rendering: under 500ms for 1000 events
\item Search/filter results: under 300ms
\item Database operations: under 100ms for single record operations
\end{itemize}

### NFR-2: Usability

\begin{itemize}
\item Intuitive interface requiring no documentation for basic operations
\item Consistent UI patterns using shadcn/ui components
\item Keyboard navigation support for all forms
\item Clear feedback for all user actions (success/error messages)
\end{itemize}

### NFR-3: Reliability

\begin{itemize}
\item Data persists across browser sessions
\item No data loss on unexpected browser closure
\item Graceful handling of storage quota exceeded scenarios
\item Automatic data persistence after each operation
\end{itemize}

### NFR-4: Security

\begin{itemize}
\item All data stored locally on user's device
\item No transmission of personal data to external servers
\item No authentication required (single-user, local app)
\item Secure context (HTTPS) when hosted
\end{itemize}

### NFR-5: Compatibility

\begin{itemize}
\item Modern browsers supporting WebAssembly, OPFS, and ES6+
\item Chrome 102+, Firefox 111+, Safari 15.2+, Edge 102+
\item No Internet Explorer support
\end{itemize}

### NFR-6: Maintainability

\begin{itemize}
\item Clean, modular React component architecture
\item TypeScript for type safety (recommended)
\item Consistent code style and documentation
\item Separation of concerns (UI, business logic, data layer)
\end{itemize}

### NFR-7: Scalability

System should handle:

\begin{itemize}
\item Up to 5 motorcycles
\item Up to 1000 events per motorcycle
\item Up to 100 MB total attachment storage
\item Performance degradation acceptable beyond these limits
\end{itemize}

## Data Model

### Motorcycles Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
name & TEXT & Yes & User-friendly name \\
brand & TEXT & Yes & Manufacturer \\
model & TEXT & Yes & Model name \\
year & INTEGER & No & Manufacturing year \\
plate\_number & TEXT & No & License plate \\
vin & TEXT & No & Vehicle ID number \\
current\_odometer & INTEGER & Yes & Current km reading \\
purchase\_date & DATE & No & Date acquired \\
purchase\_price & DECIMAL & No & Purchase cost \\
photo\_url & TEXT & No & Reference to stored photo \\
created\_at & DATETIME & Yes & Record creation time \\
updated\_at & DATETIME & Yes & Last update time \\
\hline
\end{tabular}
\caption{Motorcycles table schema}
\end{table}

### Events Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
motorcycle\_id & INTEGER & Yes & Foreign key to Motorcycles \\
date & DATE & Yes & Event date \\
odometer & INTEGER & Yes & Km reading at event \\
type & TEXT & Yes & Event type enum \\
title & TEXT & Yes & Event name \\
description & TEXT & No & Detailed description \\
cost\_parts & DECIMAL & No & Parts cost \\
cost\_labor & DECIMAL & No & Labor cost \\
cost\_total & DECIMAL & No & Total cost \\
shop\_name & TEXT & No & Service provider \\
invoice\_number & TEXT & No & Receipt reference \\
notes & TEXT & No & Additional notes \\
created\_at & DATETIME & Yes & Record creation time \\
updated\_at & DATETIME & Yes & Last update time \\
\hline
\end{tabular}
\caption{Events table schema}
\end{table}

### Attachments Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
event\_id & INTEGER & Yes & Foreign key to Events \\
filename & TEXT & Yes & Original filename \\
filepath & TEXT & Yes & OPFS storage path \\
file\_type & TEXT & Yes & MIME type \\
file\_size & INTEGER & Yes & Size in bytes \\
uploaded\_at & DATETIME & Yes & Upload timestamp \\
\hline
\end{tabular}
\caption{Attachments table schema}
\end{table}

### Event Type Enum Values

\begin{itemize}
\item MAINTENANCE - Regular service (oil, filters, etc.)
\item MODIFICATION - Upgrades or changes (lights, exhaust, etc.)
\item REPAIR - Fixing issues or damage
\item INSPECTION - Safety or regulatory checks
\item FUEL - Fuel fill-ups (optional tracking)
\item OTHER - Miscellaneous events
\end{itemize}

## User Interface Wireframes

### Screen 1: Dashboard

Components:
\begin{itemize}
\item Header with app title and motorcycle selector
\item Summary cards: Total Cost, Total Events, Last Service
\item "Log New Event" prominent button
\item Recent events list (last 10)
\item Quick links to full history and statistics
\end{itemize}

### Screen 2: Event Form (Add/Edit)

Components:
\begin{itemize}
\item Form header with title
\item Date picker (defaults to today)
\item Odometer input with validation
\item Event type dropdown
\item Title input
\item Description textarea
\item Cost inputs (parts, labor, auto-calculated total)
\item Shop name and invoice number inputs
\item File upload area for attachments
\item Notes textarea
\item Save and Cancel buttons
\end{itemize}

### Screen 3: Event History

Components:
\begin{itemize}
\item Page header with filters toggle
\item Filter panel: type, date range, search
\item Sortable table/list of events showing: date, odometer, type badge, title, cost
\item Action buttons per row: view, edit, delete
\item Pagination or infinite scroll
\end{itemize}

### Screen 4: Event Detail View

Components:
\begin{itemize}
\item Event header with type badge
\item All event information in readable layout
\item Cost breakdown if available
\item Attachment gallery
\item Edit and Delete buttons
\item Back to history link
\end{itemize}

### Screen 5: Motorcycle Profile

Components:
\begin{itemize}
\item Profile photo and basic info
\item Editable fields
\item Statistics section: total events, total cost, avg cost per km
\item Timeline preview of recent events
\item Save and Cancel buttons
\end{itemize}

### Screen 6: Statistics Dashboard

Components:
\begin{itemize}
\item Time period selector (all time, year, month)
\item Cost summary charts (pie chart by type, line chart over time)
\item Event count by type
\item Most expensive events list
\item Cost per kilometer metric
\end{itemize}

### Screen 7: Settings/Export

Components:
\begin{itemize}
\item Export section with format options (ZIP, JSON, CSV)
\item Import section with file upload
\item Storage usage indicator
\item Clear all data option (with warning)
\item About/version information
\end{itemize}

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

\begin{itemize}
\item Project setup: React + Vite + shadcn/ui
\item SQLite WASM integration
\item Database initialization and schema creation
\item Basic persistence to IndexedDB
\item Simple routing structure
\end{itemize}

### Phase 2: Core Features (Week 3-4)

\begin{itemize}
\item Motorcycle profile CRUD
\item Event logging form
\item Event list display
\item Basic validation and error handling
\end{itemize}

### Phase 3: File Management (Week 5)

\begin{itemize}
\item OPFS integration for attachments
\item File upload UI
\item Image preview and display
\item Attachment deletion
\end{itemize}

### Phase 4: Enhanced Features (Week 6-7)

\begin{itemize}
\item Filtering and search
\item Statistics dashboard
\item Cost calculations and summaries
\item Responsive design improvements
\end{itemize}

### Phase 5: Data Management (Week 8)

\begin{itemize}
\item Export functionality (ZIP, JSON, CSV)
\item Import functionality
\item Data validation on import
\item Clear data feature
\end{itemize}

### Phase 6: Polish and Deploy (Week 9-10)

\begin{itemize}
\item UI/UX refinements
\item Performance optimization
\item Browser compatibility testing
\item Firebase Hosting deployment
\item Documentation
\end{itemize}

## Constraints and Assumptions

### Constraints

\begin{itemize}
\item No backend server or API infrastructure
\item Limited to browser storage capabilities (typically 1GB+ but varies)
\item Single device usage (no sync between devices)
\item Requires modern browser with WebAssembly support
\item User responsible for data backups
\end{itemize}

### Assumptions

\begin{itemize}
\item User has basic computer literacy
\item User accesses application from same browser/device consistently
\item User performs regular data exports as backup
\item Average of 2-4 events logged per month
\item Typical attachment sizes under 2 MB
\item Browser storage quota sufficient for 2-3 years of typical use
\end{itemize}

## Risks and Mitigations

\begin{table}
\begin{tabular}{|p{4cm}|p{2cm}|p{6cm}|}
\hline
Risk & Severity & Mitigation \\
\hline
Browser storage limit exceeded & Medium & Show storage usage indicator; prompt export when approaching limit; implement data archiving \\
\hline
Data loss from browser cache clear & High & Prominent backup reminders; auto-export suggestions; clear documentation \\
\hline
Browser compatibility issues & Medium & Test on target browsers; provide compatibility notice; graceful degradation \\
\hline
SQLite WASM performance on large datasets & Low & Optimize queries; implement pagination; set realistic data limits \\
\hline
User loses backup file & Medium & Multiple export formats; encourage regular backups; simple restore process \\
\hline
OPFS API changes & Low & Monitor web platform updates; abstract storage layer for easier migration \\
\hline
\end{tabular}
\caption{Risk assessment and mitigation strategies}
\end{table}

## Success Criteria

The project will be considered successful if:

\begin{enumerate}
\item User can log maintenance events with all required information in under 2 minutes
\item All data persists reliably across browser sessions
\item Export and import functions work correctly without data corruption
\item Application loads and runs offline after initial visit
\item UI is intuitive enough for use without instructions
\item Zero recurring costs maintained throughout project lifecycle
\item User can track at least 100 events without performance issues
\item Application works on primary target browsers (Chrome, Firefox, Safari)
\end{enumerate}

## Future Enhancements (Post V1.0)

Potential features for future versions:

\begin{itemize}
\item Multi-device sync using optional cloud backend
\item Maintenance reminders based on date/odometer
\item Scheduled maintenance templates
\item Fuel efficiency tracking and statistics
\item Parts inventory management
\item Service provider directory with ratings
\item PDF report generation
\item Blockchain-based maintenance history certification
\item Integration with motorcycle service APIs
\item Social features (share with buyer when selling)
\item Mobile native apps (iOS/Android)
\end{itemize}

## Appendix A: Technology References

- React: https://react.dev
- shadcn/ui: https://ui.shadcn.com
- SQLite WASM: https://sqlite.org/wasm
- sql.js: https://github.com/sql-js/sql.js
- OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
- Firebase Hosting: https://firebase.google.com/docs/hosting

## Appendix B: Example Event Types

**Common Maintenance Events:**
\begin{itemize}
\item Engine oil change
\item Oil filter replacement
\item Air filter replacement
\item Fuel filter replacement
\item Spark plug replacement
\item Chain adjustment and lubrication
\item Brake pad replacement
\item Tire replacement
\item Battery replacement
\item Coolant flush
\end{itemize}

**Common Modification Events:**
\begin{itemize}
\item Headlight upgrade (LED, higher wattage)
\item Exhaust system replacement
\item Handlebar grips replacement
\item Mirror upgrade
\item Seat modification
\item Phone mount installation
\item USB charger installation
\item Windscreen addition
\item Side case/top case installation
\end{itemize}

## Document Revision History

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Version & Date & Author & Changes \\
\hline
1.0 & 2026-02-26 & Yan Naing & Initial requirements document \\
\hline
\end{tabular}
\caption{Document revision history}
\end{table}

# Motorbike Maintenance Tracker - Requirements Document

**Project Name:** Motorbike Maintenance Tracker  
**Version:** 1.0  
**Date:** February 26, 2026  
**Author:** Yan Naing  
**Location:** Bangkok, Thailand

## Executive Summary

This document outlines the requirements for a personal web-based motorbike maintenance tracking application. The system allows a single user to log all maintenance activities, modifications, and costs associated with their motorcycle without requiring a backend server or recurring costs. The application runs entirely in the browser using modern web technologies and stores all data locally on the user's device.

## Project Overview

### Purpose

To create a zero-cost, offline-capable web application that enables tracking of motorcycle maintenance history, modifications, and associated expenses for personal use.

### Scope

The application will support:

\begin{itemize}
\item Logging maintenance activities (oil changes, filter replacements, etc.)
\item Recording modifications and upgrades (headlight changes, exhaust upgrades, etc.)
\item Tracking costs for parts and labor
\item Storing receipt photos and documentation
\item Viewing maintenance history and statistics
\item Exporting and importing data for backup purposes
\end{itemize}

### Out of Scope (Version 1.0)

\begin{itemize}
\item Multi-user support
\item Cloud synchronization across devices
\item Automated maintenance reminders
\item Integration with external services or APIs
\item Mobile native applications
\end{itemize}

## Stakeholders

**Primary User:** Yan Naing - motorcycle owner who wants to track all maintenance and modification activities with associated costs.

## System Architecture

### Technology Stack

\begin{table}
\begin{tabular}{|l|l|l|}
\hline
Component & Technology & Justification \\
\hline
Frontend Framework & React & Modern, component-based UI development \\
UI Components & shadcn/ui & Consistent, accessible component library \\
Database & SQLite + WASM & Local-first, no backend required \\
Storage & OPFS/IndexedDB & Browser-native file and data persistence \\
Hosting & Firebase Hosting & Free tier for static sites \\
\hline
\end{tabular}
\caption{Technology stack components}
\end{table}

### Architecture Principles

\begin{enumerate}
\item \textbf{Local-First}: All data stored on user's device, no server dependency
\item \textbf{Zero Cost}: No recurring hosting or database costs
\item \textbf{Privacy}: User data never leaves their device
\item \textbf{Offline-Capable}: Works without internet connection after initial load
\item \textbf{Export/Import}: User controls their data with backup capabilities
\end{enumerate}

## Functional Requirements

### FR-1: Motorcycle Profile Management

**FR-1.1: Add Motorcycle**  
Users can create a motorcycle profile with the following information:

\begin{itemize}
\item Motorcycle name/nickname (required)
\item Brand (required)
\item Model (required)
\item Year (optional)
\item License plate number (optional)
\item VIN (Vehicle Identification Number) (optional)
\item Current odometer reading in kilometers (required)
\item Purchase date (optional)
\item Purchase price (optional)
\item Photo (optional)
\end{itemize}

**FR-1.2: Edit Motorcycle**  
Users can update any motorcycle profile information.

**FR-1.3: View Motorcycle Details**  
Users can view complete motorcycle profile including summary statistics (total maintenance cost, last service date, total modifications, etc.).

**FR-1.4: Delete Motorcycle**  
Users can delete a motorcycle profile (with confirmation dialog to prevent accidental deletion).

**FR-1.5: Multiple Motorcycles**  
System supports tracking multiple motorcycles (for future use).

### FR-2: Maintenance and Modification Logging

**FR-2.1: Log Event**  
Users can create a new maintenance or modification event with the following information:

\begin{itemize}
\item Date (required, defaults to today)
\item Odometer reading at time of service (required)
\item Event type (required): Maintenance, Modification, Repair, Inspection, Other
\item Title/Name (required): e.g., "Engine Oil Change", "Headlight Upgrade to LED"
\item Description (optional): Free text for additional details
\item Cost - Parts (optional)
\item Cost - Labor (optional)
\item Cost - Total (optional, auto-calculated if parts and labor provided)
\item Shop/Technician name (optional)
\item Invoice/Receipt number (optional)
\item Attachments (optional): Photos of receipts, parts, or completed work
\item Notes (optional): Additional observations or recommendations
\end{itemize}

**FR-2.2: Edit Event**  
Users can update any logged event information.

**FR-2.3: Delete Event**  
Users can delete an event (with confirmation).

**FR-2.4: View Event Details**  
Users can view complete information for a specific event including all attachments.

### FR-3: History and Reporting

**FR-3.1: Event Timeline**  
Display all events in reverse chronological order (most recent first) with:

\begin{itemize}
\item Date and odometer reading
\item Event type badge/icon
\item Title and brief description
\item Total cost
\item Quick action buttons (view, edit, delete)
\end{itemize}

**FR-3.2: Filter Events**  
Users can filter events by:

\begin{itemize}
\item Event type (Maintenance, Modification, Repair, etc.)
\item Date range
\item Cost range
\item Search by title or description
\end{itemize}

**FR-3.3: Event History by Type**  
View all events of a specific type (e.g., all oil changes, all modifications).

**FR-3.4: Cost Summary**  
Display total costs with breakdowns:

\begin{itemize}
\item Total spent (all time)
\item Spent by event type
\item Spent by time period (monthly, yearly)
\item Cost per kilometer
\end{itemize}

**FR-3.5: Maintenance Statistics**  
Display useful statistics:

\begin{itemize}
\item Last maintenance date and odometer
\item Total events logged
\item Most frequent maintenance types
\item Average cost per event
\end{itemize}

### FR-4: File Attachments

**FR-4.1: Upload Attachments**  
Users can attach files (images, PDFs) to events:

\begin{itemize}
\item Supported formats: JPEG, PNG, PDF
\item Maximum file size: 5 MB per file
\item Multiple files per event (up to 10)
\end{itemize}

**FR-4.2: View Attachments**  
Users can view attached images and PDFs in the browser.

**FR-4.3: Delete Attachments**  
Users can remove individual attachments from events.

**FR-4.4: Local Storage**  
All attachments stored in browser using OPFS or IndexedDB.

### FR-5: Data Management

**FR-5.1: Export Data**  
Users can export all data (database + attachments) as:

\begin{itemize}
\item Single backup file (ZIP containing SQLite DB and attachments folder)
\item JSON format (for portability)
\item CSV format (for spreadsheet analysis)
\end{itemize}

**FR-5.2: Import Data**  
Users can import previously exported backup files to restore data.

**FR-5.3: Clear All Data**  
Users can delete all data from the application (with strong confirmation warning).

### FR-6: User Interface

**FR-6.1: Responsive Design**  
Application works on desktop, tablet, and mobile browsers with appropriate layout adjustments.

**FR-6.2: Dashboard/Home Screen**  
Landing page displays:

\begin{itemize}
\item Quick stats (total cost, recent events)
\item Motorcycle selector (if multiple bikes)
\item Quick action: Log new event
\item Recent event timeline (last 5-10 events)
\end{itemize}

**FR-6.3: Navigation**  
Clear navigation structure:

\begin{itemize}
\item Dashboard
\item Events (full history)
\item Motorcycles (profile management)
\item Statistics
\item Settings/Export
\end{itemize}

**FR-6.4: Forms**  
All forms include:

\begin{itemize}
\item Clear labels and validation
\item Required field indicators
\item Input validation with helpful error messages
\item Save and cancel actions
\end{itemize}

## Non-Functional Requirements

### NFR-1: Performance

\begin{itemize}
\item Initial page load: under 3 seconds on 4G connection
\item Event list rendering: under 500ms for 1000 events
\item Search/filter results: under 300ms
\item Database operations: under 100ms for single record operations
\end{itemize}

### NFR-2: Usability

\begin{itemize}
\item Intuitive interface requiring no documentation for basic operations
\item Consistent UI patterns using shadcn/ui components
\item Keyboard navigation support for all forms
\item Clear feedback for all user actions (success/error messages)
\end{itemize}

### NFR-3: Reliability

\begin{itemize}
\item Data persists across browser sessions
\item No data loss on unexpected browser closure
\item Graceful handling of storage quota exceeded scenarios
\item Automatic data persistence after each operation
\end{itemize}

### NFR-4: Security

\begin{itemize}
\item All data stored locally on user's device
\item No transmission of personal data to external servers
\item No authentication required (single-user, local app)
\item Secure context (HTTPS) when hosted
\end{itemize}

### NFR-5: Compatibility

\begin{itemize}
\item Modern browsers supporting WebAssembly, OPFS, and ES6+
\item Chrome 102+, Firefox 111+, Safari 15.2+, Edge 102+
\item No Internet Explorer support
\end{itemize}

### NFR-6: Maintainability

\begin{itemize}
\item Clean, modular React component architecture
\item TypeScript for type safety (recommended)
\item Consistent code style and documentation
\item Separation of concerns (UI, business logic, data layer)
\end{itemize}

### NFR-7: Scalability

System should handle:

\begin{itemize}
\item Up to 5 motorcycles
\item Up to 1000 events per motorcycle
\item Up to 100 MB total attachment storage
\item Performance degradation acceptable beyond these limits
\end{itemize}

## Data Model

### Motorcycles Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
name & TEXT & Yes & User-friendly name \\
brand & TEXT & Yes & Manufacturer \\
model & TEXT & Yes & Model name \\
year & INTEGER & No & Manufacturing year \\
plate\_number & TEXT & No & License plate \\
vin & TEXT & No & Vehicle ID number \\
current\_odometer & INTEGER & Yes & Current km reading \\
purchase\_date & DATE & No & Date acquired \\
purchase\_price & DECIMAL & No & Purchase cost \\
photo\_url & TEXT & No & Reference to stored photo \\
created\_at & DATETIME & Yes & Record creation time \\
updated\_at & DATETIME & Yes & Last update time \\
\hline
\end{tabular}
\caption{Motorcycles table schema}
\end{table}

### Events Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
motorcycle\_id & INTEGER & Yes & Foreign key to Motorcycles \\
date & DATE & Yes & Event date \\
odometer & INTEGER & Yes & Km reading at event \\
type & TEXT & Yes & Event type enum \\
title & TEXT & Yes & Event name \\
description & TEXT & No & Detailed description \\
cost\_parts & DECIMAL & No & Parts cost \\
cost\_labor & DECIMAL & No & Labor cost \\
cost\_total & DECIMAL & No & Total cost \\
shop\_name & TEXT & No & Service provider \\
invoice\_number & TEXT & No & Receipt reference \\
notes & TEXT & No & Additional notes \\
created\_at & DATETIME & Yes & Record creation time \\
updated\_at & DATETIME & Yes & Last update time \\
\hline
\end{tabular}
\caption{Events table schema}
\end{table}

### Attachments Table

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Field & Type & Required & Description \\
\hline
id & INTEGER & Yes & Primary key \\
event\_id & INTEGER & Yes & Foreign key to Events \\
filename & TEXT & Yes & Original filename \\
filepath & TEXT & Yes & OPFS storage path \\
file\_type & TEXT & Yes & MIME type \\
file\_size & INTEGER & Yes & Size in bytes \\
uploaded\_at & DATETIME & Yes & Upload timestamp \\
\hline
\end{tabular}
\caption{Attachments table schema}
\end{table}

### Event Type Enum Values

\begin{itemize}
\item MAINTENANCE - Regular service (oil, filters, etc.)
\item MODIFICATION - Upgrades or changes (lights, exhaust, etc.)
\item REPAIR - Fixing issues or damage
\item INSPECTION - Safety or regulatory checks
\item FUEL - Fuel fill-ups (optional tracking)
\item OTHER - Miscellaneous events
\end{itemize}

## User Interface Wireframes

### Screen 1: Dashboard

Components:
\begin{itemize}
\item Header with app title and motorcycle selector
\item Summary cards: Total Cost, Total Events, Last Service
\item "Log New Event" prominent button
\item Recent events list (last 10)
\item Quick links to full history and statistics
\end{itemize}

### Screen 2: Event Form (Add/Edit)

Components:
\begin{itemize}
\item Form header with title
\item Date picker (defaults to today)
\item Odometer input with validation
\item Event type dropdown
\item Title input
\item Description textarea
\item Cost inputs (parts, labor, auto-calculated total)
\item Shop name and invoice number inputs
\item File upload area for attachments
\item Notes textarea
\item Save and Cancel buttons
\end{itemize}

### Screen 3: Event History

Components:
\begin{itemize}
\item Page header with filters toggle
\item Filter panel: type, date range, search
\item Sortable table/list of events showing: date, odometer, type badge, title, cost
\item Action buttons per row: view, edit, delete
\item Pagination or infinite scroll
\end{itemize}

### Screen 4: Event Detail View

Components:
\begin{itemize}
\item Event header with type badge
\item All event information in readable layout
\item Cost breakdown if available
\item Attachment gallery
\item Edit and Delete buttons
\item Back to history link
\end{itemize}

### Screen 5: Motorcycle Profile

Components:
\begin{itemize}
\item Profile photo and basic info
\item Editable fields
\item Statistics section: total events, total cost, avg cost per km
\item Timeline preview of recent events
\item Save and Cancel buttons
\end{itemize}

### Screen 6: Statistics Dashboard

Components:
\begin{itemize}
\item Time period selector (all time, year, month)
\item Cost summary charts (pie chart by type, line chart over time)
\item Event count by type
\item Most expensive events list
\item Cost per kilometer metric
\end{itemize}

### Screen 7: Settings/Export

Components:
\begin{itemize}
\item Export section with format options (ZIP, JSON, CSV)
\item Import section with file upload
\item Storage usage indicator
\item Clear all data option (with warning)
\item About/version information
\end{itemize}

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

\begin{itemize}
\item Project setup: React + Vite + shadcn/ui
\item SQLite WASM integration
\item Database initialization and schema creation
\item Basic persistence to IndexedDB
\item Simple routing structure
\end{itemize}

### Phase 2: Core Features (Week 3-4)

\begin{itemize}
\item Motorcycle profile CRUD
\item Event logging form
\item Event list display
\item Basic validation and error handling
\end{itemize}

### Phase 3: File Management (Week 5)

\begin{itemize}
\item OPFS integration for attachments
\item File upload UI
\item Image preview and display
\item Attachment deletion
\end{itemize}

### Phase 4: Enhanced Features (Week 6-7)

\begin{itemize}
\item Filtering and search
\item Statistics dashboard
\item Cost calculations and summaries
\item Responsive design improvements
\end{itemize}

### Phase 5: Data Management (Week 8)

\begin{itemize}
\item Export functionality (ZIP, JSON, CSV)
\item Import functionality
\item Data validation on import
\item Clear data feature
\end{itemize}

### Phase 6: Polish and Deploy (Week 9-10)

\begin{itemize}
\item UI/UX refinements
\item Performance optimization
\item Browser compatibility testing
\item Firebase Hosting deployment
\item Documentation
\end{itemize}

## Constraints and Assumptions

### Constraints

\begin{itemize}
\item No backend server or API infrastructure
\item Limited to browser storage capabilities (typically 1GB+ but varies)
\item Single device usage (no sync between devices)
\item Requires modern browser with WebAssembly support
\item User responsible for data backups
\end{itemize}

### Assumptions

\begin{itemize}
\item User has basic computer literacy
\item User accesses application from same browser/device consistently
\item User performs regular data exports as backup
\item Average of 2-4 events logged per month
\item Typical attachment sizes under 2 MB
\item Browser storage quota sufficient for 2-3 years of typical use
\end{itemize}

## Risks and Mitigations

\begin{table}
\begin{tabular}{|p{4cm}|p{2cm}|p{6cm}|}
\hline
Risk & Severity & Mitigation \\
\hline
Browser storage limit exceeded & Medium & Show storage usage indicator; prompt export when approaching limit; implement data archiving \\
\hline
Data loss from browser cache clear & High & Prominent backup reminders; auto-export suggestions; clear documentation \\
\hline
Browser compatibility issues & Medium & Test on target browsers; provide compatibility notice; graceful degradation \\
\hline
SQLite WASM performance on large datasets & Low & Optimize queries; implement pagination; set realistic data limits \\
\hline
User loses backup file & Medium & Multiple export formats; encourage regular backups; simple restore process \\
\hline
OPFS API changes & Low & Monitor web platform updates; abstract storage layer for easier migration \\
\hline
\end{tabular}
\caption{Risk assessment and mitigation strategies}
\end{table}

## Success Criteria

The project will be considered successful if:

\begin{enumerate}
\item User can log maintenance events with all required information in under 2 minutes
\item All data persists reliably across browser sessions
\item Export and import functions work correctly without data corruption
\item Application loads and runs offline after initial visit
\item UI is intuitive enough for use without instructions
\item Zero recurring costs maintained throughout project lifecycle
\item User can track at least 100 events without performance issues
\item Application works on primary target browsers (Chrome, Firefox, Safari)
\end{enumerate}

## Future Enhancements (Post V1.0)

Potential features for future versions:

\begin{itemize}
\item Multi-device sync using optional cloud backend
\item Maintenance reminders based on date/odometer
\item Scheduled maintenance templates
\item Fuel efficiency tracking and statistics
\item Parts inventory management
\item Service provider directory with ratings
\item PDF report generation
\item Blockchain-based maintenance history certification
\item Integration with motorcycle service APIs
\item Social features (share with buyer when selling)
\item Mobile native apps (iOS/Android)
\end{itemize}

## Appendix A: Technology References

- React: https://react.dev
- shadcn/ui: https://ui.shadcn.com
- SQLite WASM: https://sqlite.org/wasm
- sql.js: https://github.com/sql-js/sql.js
- OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
- Firebase Hosting: https://firebase.google.com/docs/hosting

## Appendix B: Example Event Types

**Common Maintenance Events:**
\begin{itemize}
\item Engine oil change
\item Oil filter replacement
\item Air filter replacement
\item Fuel filter replacement
\item Spark plug replacement
\item Chain adjustment and lubrication
\item Brake pad replacement
\item Tire replacement
\item Battery replacement
\item Coolant flush
\end{itemize}

**Common Modification Events:**
\begin{itemize}
\item Headlight upgrade (LED, higher wattage)
\item Exhaust system replacement
\item Handlebar grips replacement
\item Mirror upgrade
\item Seat modification
\item Phone mount installation
\item USB charger installation
\item Windscreen addition
\item Side case/top case installation
\end{itemize}

## Document Revision History

\begin{table}
\begin{tabular}{|l|l|l|l|}
\hline
Version & Date & Author & Changes \\
\hline
1.0 & 2026-02-26 & Yan Naing & Initial requirements document \\
\hline
\end{tabular}
\caption{Document revision history}
\end{table}