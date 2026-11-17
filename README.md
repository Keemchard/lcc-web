# Livingwater Community Church — Web Application

A full-stack church management web application for Livingwater Community Church in Tanza, Cavite, Philippines. Serves as both the public-facing church website and an internal admin panel for managing content, finances, and property.

**Live:** https://lcc-web.vercel.app

## Tech Stack

- **Framework:** Next.js 16 (Turbopack), React 19, TypeScript
- **Styling:** SCSS Modules, Poppins font
- **Auth & Database:** Firebase Auth + Cloud Firestore
- **Image Storage:** Vercel Blob (Singapore region)
- **Icons:** Font Awesome 7
- **Maps:** Leaflet / React-Leaflet
- **Carousel:** Embla Carousel
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project (Auth + Firestore enabled)
- Vercel account with Blob store

### Setup

1. Clone the repo:
```bash
git clone https://github.com/Keemchard/lcc-web.git
cd lcc-web
npm install
```

2. Create `.env.local` with your credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=        # base64-encoded service account JSON
SUPREME_ADMIN_EMAIL=                 # auto-promoted to supreme admin on first login
BLOB_STORE_ID=
BLOB_READ_WRITE_TOKEN=
```

3. Run the dev server:
```bash
npm run dev
```

4. Sign up at `/signup` with the supreme admin email, then log in at `/login`.

## Features

### Public Website

- **Home** — hero carousel, dynamic service times, contact info, embedded map
- **About** — church history (est. 1984), mission, vision, L-C-C core values, ministries, leadership
- **Service Times** — all 6 weekly activities (Morning Devotion, Sunday Service, Sunday School, Prayer Meeting, Outreach Bible Study, Dawn Watch)
- **SEO** — full metadata, Open Graph, Twitter cards, JSON-LD structured data, sitemap, robots.txt

### Admin Dashboard (`/admin`)

- **Carousel Management** — CRUD with drag-to-reorder, image upload with auto-compression (WebP, max 1920x1080)
- **Service Times Management** — CRUD with drag-to-reorder, dynamic Prayer Meeting CTA
- **Finance Dashboard** — monthly receipts & disbursements, church building fund, charts (bar/pie), yearly exports
- **Budget Planning** — annual budget by ministry section, Budget vs Actual comparison with variance analysis
- **Property Management** — asset inventory, condition tracking, maintenance history, borrow log, printable audit reports
- **Change History** — audit trail of all data modifications with expandable diffs
- **User Management** — approval-based system (supreme admin approves new users)

### Security

- HTTP-only session cookies (SameSite=strict, Secure)
- Server-side token verification on every API route
- Role-based access control (pending → admin → supreme_admin)
- 30-minute inactivity auto-logout
- Auto session refresh every 45 minutes while active
- Token revocation on logout
- Security headers (X-Frame-Options: DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cache-Control: no-store on API)
- Password requirements (8+ chars, uppercase, number)
- Login tracking (timestamp + IP)
- Image compression before upload

## Project Structure

```
app/
  (public)/           # Public pages (home, about, service-times, login, signup)
  (admin)/admin/      # Admin pages (dashboard, carousels, service-times, finance, property, history, users)
  api/                # API routes (auth, upload, carousels, service-times, finance, property, history, users)
components/           # Shared components (Nav, Footer, Card, Carousel, AdminSidebar, ImageUpload)
lib/                  # Firebase config, auth context, Firestore helpers
types/                # TypeScript types (finance, budget, property)
styles/               # SCSS variables, mixins, typography, reset
constants/            # Navigation, service times, contacts, hero CTA
public/images/        # Static images (logo, hero backgrounds, service photos)
```

## Documentation

See [FEATURES.md](FEATURES.md) for complete feature documentation including all admin pages, security measures, and technical architecture details.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client SDK config (6 vars) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Base64-encoded service account JSON |
| `SUPREME_ADMIN_EMAIL` | Email for auto-promotion to supreme admin |
| `BLOB_STORE_ID` | Vercel Blob store ID |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
