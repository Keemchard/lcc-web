# Livingwater Community Church — Web Application Documentation

## Overview

A full-stack church management web application built with Next.js 16, React 19, Firebase Auth, Cloud Firestore, and Vercel Blob. It serves as both the public-facing church website and an internal admin panel for managing content, finances, and property.

**Live URL:** https://lcc-web.vercel.app  
**Stack:** Next.js 16 (Turbopack), React 19, TypeScript, SCSS Modules, Firebase Auth + Firestore, Vercel Blob

---

## 1. Public Website

### 1.1 Home Page (`/`)

- **Hero section** — full-viewport background image carousel (3 images, 7-second autoplay) with dark overlay. Displays the church name, motto ("Love God. Love People. Make Disciples."), and 4 CTA buttons: Who We Are, Service Times, Location, Join Live
- **Carousel section** — dynamic image slides pulled from Firestore (managed by admin). Displays title, details, and time overlay on each slide. Falls back to empty state if no slides exist
- **Service times section** — cards showing worship schedules pulled from Firestore. Each card has an image, title, time, location, and speaker. Falls back to hardcoded constants if Firestore is empty. Dynamic CTA for Prayer Meeting (shows "Join Online" with Google Meet link on Wednesdays, "Join in Person" on last Wednesday of month)
- **Contact section** — quick links, contact information (phone numbers, email, Facebook Messenger), embedded Leaflet map centered on the church location, and footer with social media links
- **SEO** — full metadata, Open Graph tags, Twitter cards, JSON-LD structured data (schema.org Church type), sitemap.xml, robots.txt

### 1.2 About Page (`/about`)

- **Hero** — dark background with church image, eyebrow label, heading, subtitle mentioning 42+ years in Tanza, Cavite
- **Our Story** — church history since founding in 1984, real ministry mentions (Libreng Almusal, Dawn Watch, Bible studies, etc.)
- **Mission & Vision** — real statements from the church
  - Mission: "We exist to glorify God, by loving Him and our neighbors, preaching His Word, making disciples, and serving with compassion."
  - Vision: "A Christ-centered church where every member is equipped to evangelize and make disciples to impact the community and beyond for God's glory."
- **Core Values** — L-C-C values with Bible references:
  - L — Love for God and people (Matthew 22:37–39)
  - C — Commitment to the Word of God (2 Timothy 2:15)
  - C — Called and commissioned to make disciples (Matthew 28:19–20)
- **Ministries** — grid of 10 real ministries
- **What We Believe** — doctrinal beliefs
- **Leadership** — Rev. Raffy Salvador (Senior Pastor), Rev. Robert De Guzman (Associate Pastor)
- **Join CTA** — invitation to attend with link to service times

### 1.3 Service Times Page (`/service-times`)

- Full page listing all 6 weekly activities:
  - Sunday 7:40 AM — Morning Devotion
  - Sunday 8:00 AM — Sunday Service
  - Sunday 10:30 AM — Sunday School
  - Wednesday 7:30 PM — Prayer Meeting
  - Thursday–Saturday 2:00–6:00 PM — Outreach Bible Study
  - Saturday 4:00 AM — Dawn Watch
- Linked from the "View All" button on the home page

### 1.4 Login Page (`/login`)

- Dark background (matches church nav aesthetic) with centered white card
- LCC logo icon at top
- Email/password form + Google sign-in button
- "Back to Home" link
- Error messages for invalid credentials or pending approval
- Link to signup page

### 1.5 Signup Page (`/signup`)

- Same dark background styling
- Full name, email, and password fields
- Password requirements: minimum 8 characters, at least 1 uppercase letter, at least 1 number
- On success: shows "Account Created — pending approval" message
- Link back to login

---

## 2. Admin Dashboard

Accessible at `/admin`. Requires approved admin or supreme admin role.

### 2.1 Dashboard Overview (`/admin`)

- Welcome message with quick-link cards to Carousel Slides, Service Times, and Change History

### 2.2 Carousel Slides Management (`/admin/carousels`)

- **List view** — table showing all slides with thumbnail, title, time, and action buttons
- **Drag-to-reorder** — grip handle on each row, drag to rearrange display order. Order saves to Firestore automatically via batch update
- **Add slide** (`/admin/carousels/new`) — form with:
  - Image upload (drag-and-drop, auto-compressed to WebP max 1920x1080 at 80% quality before upload)
  - Title, details, time, order fields
  - Uploads to Vercel Blob (public, Singapore region)
- **Edit slide** (`/admin/carousels/[id]`) — pre-filled form, option to replace image
- **Delete** — confirmation prompt, removes from Firestore and deletes blob image
- All changes logged to change history

### 2.3 Service Times Management (`/admin/service-times`)

- Same pattern as carousel: list, drag-to-reorder, add, edit, delete
- Fields: image, title, time, location, speaker, CTA label, CTA href (optional), order
- Changes reflected on the public landing page

### 2.4 Finance Dashboard (`/admin/finance`)

#### Dashboard Tab (default)

- **Year selector** — toggle between years with data
- **4 summary cards:**
  - Total Tithes & Offerings (with breakdown: general fund tithes vs building fund offerings)
  - Total Expenses (with breakdown: general fund vs building fund)
  - General Fund Balance (latest month)
  - Building Fund Balance (latest month)
- **Monthly income vs expenses** — grouped bar chart (blue=income, red=expenses) with pie chart toggle showing income vs expenses donut with net amount in center
- **Where the money goes** — horizontal bar chart of spending categories ranked by amount
- **Spending categories table** — all categories with amount and % share, top 5 highlighted, "See all" button to expand
- **Export button** — yearly export per selected year

#### Reports Tab

- Filter by: All / Receipts & Disbursements / Church Building
- Table: period, type badge, total income, total expenses, balance, actions (view/delete)

#### Monthly Report Form (`/admin/finance/new`, `/admin/finance/[id]`)

- **Report type** — Statement of Receipts & Disbursements or Offering - Church Building
- **Month/year selector**
- **Balance forwarded** — auto-populated from previous month's ending balance (per report type)
- **Income entries** — date picker (stores as "4-Oct" format) + ₱ currency input per row, add/remove rows
- **Additional income** (receipts only) — configurable items (e.g. D4 Electricity Share)
- **Auto-computed:** Total Tithes/Offerings, Total Cash Available
- **Disbursements** — organized by category:
  - Receipts default categories: Finance/Administration (16 items), Ministry-Christian Education (3), Ministry-Fellowship (3), Ministry-Mission and Evangelism (2), Ministry-Membership (3), Ministry-Trustees (12), Ministry-Training (3)
  - Building default categories: Cash Disbursement (Pantry Expenses, Total Materials, Total Labor)
  - Admin can add/remove items and categories
  - Each category shows auto-computed subtotal
- **Auto-computed:** Total Expenses, Balance to Forward
- **Signatories** — pre-filled:
  - Receipts: Elenita Tamio (Treasurer) + Marites Luis (Auditor)
  - Building: Rhea Bago (Property Custodian Head) + Marites Luis (Auditor)
- All amounts use ₱ currency prefix inputs

#### Print / Export (`/admin/finance/[id]/print`)

- Printable view matching the paper report format
- LCC logo, church name, report title
- All line items with amounts, category subtotals, grand totals
- Signatory section at bottom
- Print button calls `window.print()` for PDF export

#### Yearly Export (`/admin/finance/export?year=YYYY`)

- Monthly summary tables for both Receipts and Building fund
- Expense breakdown by category with amount and % share
- Generation date footer
- Print/export button

#### Budget Planning (`/admin/finance/budget`)

- **Budget list** — cards showing each year's budget with total amount
- **New budget** (`/admin/finance/budget/new`) — form with 9 default sections:
  1. Fellowship Coordinator (4 items)
  2. Training Director (4 items)
  3. Sunday School Director (4 items)
  4. Program Coordinator (5 items)
  5. Membership Coordinator (4 items)
  6. Property Custodian (7 items)
  7. Finance / Administration (6 items)
  8. Mission and Evangelism (4 items)
  9. Church Building (3 items)
  - Each item has: label, ₱ amount, remarks field
  - Add/remove sections and items
  - Auto-computed section subtotals and grand total
  - Notes field
- **Edit + Budget vs Actual** (`/admin/finance/budget/[id]`) — two tabs:
  - **Edit budget** — same form, pre-filled
  - **Budget vs Actual** — comparison dashboard:
    - Summary cards: Total Budgeted, Total Actual Spending, Variance, Utilization %
    - Comparison table: each section shows Budgeted vs Actual vs Variance (green=under, red=over budget)
    - Unbudgeted spending appears with red "Unbudgeted" tag (any finance category not mapped to a budget section)
    - Grouped bar chart: budget vs actual per section
    - Pie chart toggle: budget allocation by section
    - Pulls actual data from both Receipts AND Building fund reports
    - Category mapping: Fellowship Coordinator→Ministry-Fellowship, Training Director→Ministry-Training, etc.
    - Fuzzy matching for custom categories

### 2.5 Property Management (`/admin/property`)

#### Dashboard

- **4 summary cards:** Total Items, Total Value (₱), Items Needing Repair, Currently Borrowed
- **Condition breakdown** — horizontal bars (Good=green, Fair=amber, Needs Repair=orange, Condemned=red)
- **Category breakdown** — horizontal bars by category
- **Recent borrow activity** — last 5 borrow records

#### Items (`/admin/property/items`)

- Searchable by name
- Filter by category dropdown (Furniture, Electronics, Kitchen, Musical Instruments, Office, Building, Sound System, Cleaning, Other)
- Filter by condition dropdown (Good, Fair, Needs Repair, Condemned)
- Color-coded condition badges
- Table: name, category, quantity, condition, location, value (₱), actions

#### Add/Edit Item (`/admin/property/items/new`, `/admin/property/items/[id]`)

- Fields: name, category, quantity, condition, location (Worship Hall, Kitchen, Office, Storage Room, etc.), date acquired, acquisition type (Purchased/Donated), value (₱), notes
- **Edit page includes Maintenance History:**
  - Log of repairs: date, description, cost (₱), performed by
  - Inline form to add new maintenance entries

#### Borrow Log (`/admin/property/borrow`)

- Filter tabs: All / Borrowed / Returned
- Modal for new borrow records (select asset from dropdown, borrower name, purpose, date out)
- "Mark Returned" button — auto-fills today's date, updates status
- Status badges: Borrowed=amber, Returned=green

#### Export (`/admin/property/export`)

- Printable inventory list with LCC header
- Full asset table: #, name, category, quantity, condition, location, date acquired, value
- Totals row
- Signatory section: Rhea Bago (Property Custodian Head) + Marites Luis (Auditor)

### 2.6 Change History (`/admin/history`)

- Chronological log of all create/update/delete operations across carousel, service times, finance, and property
- Table: date/time, action badge (create=green, update=blue, delete=red), entity type, title, performed by email
- Expandable diff view for updates showing field-by-field changes (before → after)

### 2.7 User Management (`/admin/users`) — Supreme Admin Only

- **Pending Approval** section — table of users awaiting approval with Approve/Reject buttons
- **Approved Admins** section — table of active admins with role display
- Approve → sets role to "admin", records approver and timestamp
- Reject → deletes user from Firestore and Firebase Auth

---

## 3. Authentication & Authorization

### 3.1 Auth Flow

1. **Signup** → creates Firebase Auth user + Firestore `users/{uid}` document with `role: "pending"`
2. **Login** → Firebase client-side auth (email/password or Google) → exchanges ID token for HTTP-only session cookie via `/api/auth/login`
3. **Supreme admin auto-promotion** → if email matches `SUPREME_ADMIN_EMAIL` env var and no supreme admin exists, automatically promoted on first login
4. **Pending users** → receive "Your account is pending approval" message on login attempt
5. **Approval** → supreme admin approves via User Management → role changes to "admin"

### 3.2 Roles

| Role | Access |
|------|--------|
| `pending` | Cannot access admin. Shown "pending approval" message |
| `admin` | Full admin access except user management |
| `supreme_admin` | Full admin access + user management (approve/reject users) |

### 3.3 Route Protection

- **Proxy (`proxy.ts`)** — redirects `/admin/*` to `/login` if no session cookie exists
- **Admin layout (server-side)** — verifies session token with Firebase Admin SDK, checks user role in Firestore, redirects to `/login` if invalid
- **API routes** — every admin endpoint calls `verifyAdmin()` which reads the session cookie and verifies the token + role

---

## 4. Security Measures

### 4.1 Session Security

- **HTTP-only cookies** — session token stored as HTTP-only cookie, inaccessible to JavaScript (prevents XSS token theft)
- **SameSite=strict** — cookies only sent on same-site requests (prevents CSRF)
- **Secure flag** — cookies only sent over HTTPS in production
- **1-hour token expiry** — Firebase ID tokens expire after 60 minutes
- **Auto session refresh** — `SessionGuard` component refreshes the token every 45 minutes while user is active
- **Inactivity auto-logout** — 30 minutes of no mouse/keyboard/scroll/touch activity → automatic logout and redirect to login
- **Token revocation on logout** — `revokeRefreshTokens` invalidates all sessions for the user across all devices

### 4.2 Server-Side Verification

- **Every API route** verifies the session token server-side via Firebase Admin SDK (`verifyIdToken`)
- **Role check** on every request — even if the token is valid, the user's Firestore role must be "admin" or "supreme_admin"
- **Admin layout** performs server-side auth check before rendering any admin page

### 4.3 Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents admin pages from being embedded in iframes (clickjacking protection) |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Doesn't leak admin URLs in referrer headers |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unnecessary browser APIs on admin pages |
| `Cache-Control` | `no-store, no-cache, must-revalidate` | API responses never cached |

### 4.4 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Full name minimum 2 characters

### 4.5 Login Tracking

- Every successful login records timestamp and IP address to Firestore
- Change history tracks all data modifications with who made them and when

### 4.6 Image Security

- Images compressed client-side before upload (max 1920x1080, WebP, 80% quality)
- Uploaded to Vercel Blob (public, CDN-backed)
- Admin-only upload endpoint (`/api/upload`) — requires authenticated session

### 4.7 Data Protection

- Firebase Admin SDK credentials stored as base64-encoded environment variable
- `.env.local` excluded from git via `.gitignore`
- Firestore Admin SDK bypasses client-side security rules (server-only access)
- No sensitive data exposed in client-side code

---

## 5. Technical Architecture

### 5.1 Route Structure

```
app/
  layout.tsx              # Root: fonts, AuthProvider
  (public)/
    layout.tsx            # Public: Navigation bar
    page.tsx              # Home
    about/                # About page
    service-times/        # View all service times
    login/                # Login page
    signup/               # Signup page
  (admin)/
    layout.tsx            # Admin: auth check + sidebar + SessionGuard
    admin/
      page.tsx            # Dashboard
      carousels/          # Carousel CRUD
      service-times/      # Service times CRUD
      finance/            # Finance dashboard, reports, budget
      property/           # Property management
      history/            # Change history
      users/              # User management
  api/
    auth/                 # Login, logout, session
    upload/               # Image upload (Vercel Blob)
    carousels/            # Carousel CRUD + reorder
    service-times/        # Service times CRUD + reorder
    finance/              # Finance reports + budget CRUD
    property/             # Property items + borrow CRUD
    history/              # Change history
    users/                # User management
```

### 5.2 Data Storage

| Data | Storage | Why |
|------|---------|-----|
| Users, roles | Firebase Auth + Firestore | Auth handles login, Firestore stores roles/metadata |
| Carousel slides, service times | Firestore | Dynamic content managed by admin |
| Finance reports, budgets | Firestore | Structured financial data with auto-computation |
| Property items, borrow records | Firestore | Asset inventory and tracking |
| Change history | Firestore | Audit trail of all modifications |
| Images | Vercel Blob (Singapore) | Free tier, CDN-backed, no billing required |

### 5.3 Image Optimization

- Client-side compression before upload (Canvas API → WebP)
- Next.js Image component with `sizes` prop for responsive loading
- First visible images use `priority` (eager load), rest use `loading="lazy"`
- Images served through Next.js image optimization pipeline

---

## 6. Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Base64-encoded service account JSON |
| `SUPREME_ADMIN_EMAIL` | Email for auto-promotion to supreme admin |
| `BLOB_STORE_ID` | Vercel Blob store ID |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
