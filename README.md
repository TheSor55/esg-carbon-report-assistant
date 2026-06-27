# ESG Carbon Report Assistant

> **TH:** ระบบ Web Application / Dashboard / Internal Tool สำหรับงาน ISO, Carbon, ESG, Audit, Checklist และ GHG reporting
>
> **EN:** A bilingual ESG/GHG carbon reporting dashboard and internal tool for ISO 14064-1, TGO CFO, audit readiness, and evidence-driven reporting workflows.

## 1. Project Name

**ESG Carbon Report Assistant**

Repository package name: `esg-carbon-report-assistant`

## 2. Status

**Status: MVP**

This project is classified as an **MVP**, not just a prototype, because it includes a working Next.js application, dashboard pages, bilingual TH/EN UI, demo data fallback, Prisma-ready PostgreSQL schema, CRUD APIs, CRUD data-entry forms, calculation preview, export routes, and build/test scripts.

It is **not marked as Production-ready** because the current codebase does not yet include full authentication, production RBAC enforcement, production file upload storage, deployment infrastructure, monitoring, backup strategy, or a complete security hardening process.

> **TH:** สถานะคือ MVP เพราะใช้งาน demo และ data-entry flow ได้จริงแล้ว แต่ยังไม่ควรเรียกว่า Production-ready จนกว่าจะเพิ่ม Auth, deployment, security hardening และ production storage ให้ครบ

## 3. Overview

ESG Carbon Report Assistant is a full-stack web application for organizations that need to collect, calculate, review, and report greenhouse gas activity data.

The app is designed for Carbon Footprint for Organization (CFO), GHG Inventory, ISO 14064-1 reporting, Thailand TGO-aligned evidence readiness, internal audit preparation, and ESG management dashboards.

It supports two operating modes:

- **Demo Mode:** runs with in-repository sample data when `DATABASE_URL` is not configured.
- **Database Mode:** uses PostgreSQL through Prisma when `DATABASE_URL` is configured.

> **TH:** ระบบนี้ช่วยให้โรงงานหรือองค์กร SME ทดลองเก็บข้อมูลกิจกรรมคาร์บอน เลือก emission factor แนบหลักฐาน ตรวจความพร้อม และดู dashboard/report ได้ใน flow เดียว

## 4. Problem Statement

Many SME factories and ESG teams still manage GHG inventory work through spreadsheets, email attachments, manual evidence folders, and disconnected emission factor tables. This creates several risks:

- Carbon activity data is scattered across teams.
- Evidence is often missing or difficult to trace before audit.
- Emission factor values may be overwritten without version history.
- Calculation results may not preserve original quantity, unit, EF ID, and EF version.
- Management dashboards and reports take too long to prepare.
- Audit and verification readiness is hard to review consistently.

> **TH:** ปัญหาหลักคือข้อมูลกระจัดกระจาย หลักฐานไม่ครบ และการคำนวณย้อนกลับยาก โดยเฉพาะเมื่อทำงานผ่าน Excel หลายไฟล์

## 5. Objectives

- Provide a practical ESG/GHG dashboard for SME and internal team workflows.
- Preserve activity data, original units, responsible persons, evidence references, and data quality status.
- Maintain emission factor versions without overwriting historical records.
- Support demo presentations without requiring a database.
- Prepare the system for PostgreSQL-backed database mode.
- Create a clean portfolio-ready GitHub repository with documentation and security-safe configuration.
- Provide a future foundation for authentication, PWA, mobile app, and enterprise deployment.

## 6. Key Features

- Dashboard with total emissions, scope summary, monthly trend, category chart, site summary, hotspot ranking, and evidence completeness.
- Organization and boundary page for reporting year, base year, consolidation approach, operational boundary, facilities, departments, assumptions, and exclusions.
- Activity data CRUD UI with add/edit/delete actions, validation, duplicate checks, evidence warnings, EF warnings, and tCO2e preview.
- Emission factor master with versioned factors, metadata-only edits, deactivation flow, verification status, and historical preservation rules.
- Evidence metadata register with activity linking, document date, data period, URL, owner, status, reviewer comments, and notes.
- Verification workspace with checklist, data gap report, calculation audit trail, and change log notes.
- Structured ESG/GHG report page with organization profile, boundary, methodology, inventory summary, hotspots, evidence summary, assumptions, exclusions, and verification readiness.
- Export endpoints for CSV, Excel workbook, evidence register, and report output.
- Prisma schema for organizations, facilities, departments, reporting periods, activity records, emission factors, evidence, calculation results, audit logs, reports, users, and roles.
- TH/EN language toggle for key screens, navigation, forms, validations, warnings, and system messages.

## 7. Target Users

- Admin
- ESG Manager
- Data Owner
- Reviewer
- ISO Officer
- Internal Auditor
- External Verifier
- ESG / Carbon Consultant
- Production Team
- Facility / Maintenance Team
- Procurement / Logistics / HR Teams
- Management Team

## 8. Use Cases

- Demonstrate a carbon accounting MVP to SME factories.
- Record monthly electricity, fuel, refrigerant, material, waste, water, and travel activity data.
- Maintain a version-controlled emission factor master.
- Link evidence metadata to activity records before verification.
- Review missing evidence and data quality gaps.
- Prepare an ISO 14064-1 / TGO CFO-aligned GHG inventory dashboard.
- Export activity data, calculation workbook, evidence register, and report output.
- Use demo mode for client presentations without setting up PostgreSQL.
- Use database mode as a foundation for real implementation.

## 9. Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, React 18, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL in database mode |
| ORM | Prisma |
| Validation | Zod |
| Charts | Recharts |
| Export | CSV routes, ExcelJS, PDFKit / structured report output |
| Testing | TypeScript typecheck, calculation engine test |
| Dev Runtime | Node.js, npm |
| Deployment Target | Vercel, Render, Railway, VPS, or internal server |

## 10. Project Structure

```text
/
|-- README.md
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- .env.example
|-- LICENSE
|-- docs/
|   |-- overview.md
|   |-- system-flow.md
|   |-- tech-stack.md
|   |-- modules.md
|   |-- screenshots/
|-- prisma/
|   |-- schema.prisma
|   |-- seed.ts
|-- public/
|   |-- references/
|-- references/
|-- src/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- activity-data/
|   |   |-- emission-factors/
|   |   |-- evidence/
|   |   |-- organization-boundary/
|   |   |-- reports/
|   |   |-- verification/
|   |   |-- api/
|   |-- components/
|   |   |-- forms/
|   |   |-- app-shell.tsx
|   |   |-- dashboard-charts.tsx
|   |   |-- language-provider.tsx
|   |   |-- ui.tsx
|   |-- lib/
|       |-- calculation-engine.ts
|       |-- data.ts
|       |-- exporters.ts
|       |-- i18n.ts
|       |-- sample-data.ts
|       |-- types.ts
|-- index.html
|-- app.js
|-- styles.css
```

Notes:

- `src/` contains the active Next.js application.
- `prisma/` contains the database schema and seed script.
- `docs/` contains supporting documentation for portfolio and handoff.
- `index.html`, `app.js`, and `styles.css` are retained as an earlier static prototype.

## 11. Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL only if using database mode

### Install

```bash
npm install
```

### Run In Demo Mode

Demo mode works without `.env` and without PostgreSQL.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

In demo mode, the UI loads sample data and all major pages can be reviewed. Add/edit/delete forms can be opened, but changes are preview-only until `DATABASE_URL` is configured.

### Run In Database Mode

Copy the environment template:

```bash
copy .env.example .env
```

Set a real PostgreSQL connection string in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/esg_carbon_assistant?schema=public"
NEXT_PUBLIC_APP_NAME="ESG Carbon Report Assistant"
```

Generate Prisma client:

```bash
npm run db:generate
```

Run migration:

```bash
npm run db:migrate
```

Seed sample data:

```bash
npm run db:seed
```

Start development server:

```bash
npm run dev
```

### Quality Checks

```bash
npm run typecheck
npm run test
npm run build
```

### GitHub Pages Demo

The GitHub Pages version uses the static files at the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `demo-entry.js`

It includes demo activity data entry using browser `localStorage`. This is useful for portfolio demos and client walkthroughs, but it is not a shared database.

GitHub Pages demo also supports a portable demo workspace:

- create or edit a demo company profile
- add custom activity records
- export the workspace as a `.json` file
- import that `.json` file on another computer/browser to continue the demo

For real multi-user data entry, deploy the Next.js app with PostgreSQL. See [`docs/deployment.md`](docs/deployment.md).

## 12. Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Optional for demo mode, required for database mode | PostgreSQL connection string used by Prisma. Use a real value only in `.env`, never in committed files. |
| `NEXT_PUBLIC_APP_NAME` | Optional | Public app display name. Safe because it is exposed to the browser. |

Do not commit real `.env` files. This repository only includes `.env.example` with placeholder values.

## 12.1 Deployment Modes

| Mode | URL / Host | Data Persistence | Best For |
| --- | --- | --- | --- |
| GitHub Pages Static Demo | GitHub Pages | Browser `localStorage` only | Portfolio, demo, quick user preview |
| Next.js Demo Mode | Next.js hosting without `DATABASE_URL` | In-repository sample data | MVP walkthrough |
| Next.js Database Mode | Next.js hosting + PostgreSQL | Shared database through Prisma | Real data entry foundation |

## 13. Screenshots

Screenshot folder:

```text
docs/screenshots/
```

Recommended portfolio screenshots:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/activity-data.png`
- `docs/screenshots/emission-factors.png`
- `docs/screenshots/evidence.png`
- `docs/screenshots/report-page.png`
- `docs/screenshots/mobile-view.png`

TODO:

- Add real screenshots after final UI review.
- Avoid screenshots containing real customer data, employee data, internal evidence, or private URLs.

## 14. Roadmap

### Phase 1: Prototype

- Static UI concept
- Dashboard direction
- Early ESG/GHG workflow structure

### Phase 2: MVP

- Next.js application
- Demo mode fallback
- Prisma-ready data model
- CRUD APIs
- Data-entry UI
- Bilingual TH/EN interface
- Dashboard, reports, verification, and exports

### Phase 3: Production Foundation

- Authentication
- Role-based access control enforcement
- Production database setup
- Real evidence file upload storage
- Audit log UI
- Deployment pipeline
- Backup and environment management

### Phase 4: Mobile / Enterprise Expansion

- PWA support
- Mobile-friendly data capture
- Offline-first activity input
- Flutter or native mobile app option
- Enterprise integrations
- Advanced report templates

## 15. Security Notes

- This repository is intended to contain demo/sample data only.
- Do not commit `.env`, real database URLs, API keys, service accounts, private tokens, customer data, employee data, internal ISO documents, internal Excel files, or real audit evidence.
- `.gitignore` excludes common secret files, local build outputs, and dependency folders.
- `.env.example` uses placeholder values only.
- Authentication screens and production RBAC enforcement are not implemented yet.
- Evidence upload currently stores metadata/URLs only; production file storage is TODO.
- TGO reference PDFs included in `references/` and `public/references/` should be reviewed for license and redistribution requirements before publishing a public repository.

## 16. License / Usage Note

**Internal / Demo Use Only**

This repository is prepared for portfolio demonstration, MVP validation, and internal prototype development.

If the project will be released publicly as open source, replace the current usage note with an approved license such as MIT, Apache-2.0, or a private commercial license.

> **TH:** โปรเจกต์นี้เหมาะสำหรับ Demo, Portfolio และ MVP validation ก่อนต่อยอดเป็นระบบใช้งานจริง กรุณาอย่าใส่ข้อมูลลูกค้าจริงหรือข้อมูลลับลงใน repository
