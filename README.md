# ESG Carbon Report Assistant

## Status

**MVP**

This project is more than a static prototype: it has a working Next.js UI, bilingual TH/EN interface, demo data fallback, Prisma-ready PostgreSQL schema, CRUD APIs, data-entry forms, calculation preview, export routes, and build/test scripts. It is not yet fully production-ready because authentication, production file storage, and deployment hardening are still pending.

## Overview

ESG Carbon Report Assistant is a web application for Carbon Footprint for Organization (CFO), GHG inventory, ISO 14064-1 reporting, TGO-aligned evidence readiness, and ESG report preparation.

The app helps SME factories, ESG teams, consultants, auditors, and management teams collect carbon activity data, preserve emission factor versions, link evidence, review readiness gaps, and generate structured ESG/GHG report outputs.

The repository is safe to use as a portfolio, MVP, client demo, or foundation for a production implementation.

## Key Features

- Executive dashboard with total emissions, scope totals, monthly trend, category chart, site summary, hotspots, and evidence completeness.
- Organization and boundary setup for reporting year, base year, consolidation approach, facilities, departments, assumptions, and exclusions.
- Activity data CRUD UI with required-field validation, duplicate checks, evidence warnings, EF warnings, and tCO2e preview.
- Emission factor master with versioned factors, metadata-only edits, deactivation, verification status, and historical EF preservation.
- Evidence metadata register with activity linking, owner, status, document date, URL, and reviewer comments.
- Verification workspace with checklist, data gaps, calculation audit trail, and change log notes.
- Structured report page and export endpoints for CSV, Excel workbook, evidence register, and report HTML/PDF-style output.
- Prisma-ready PostgreSQL data model with demo fallback when `DATABASE_URL` is not configured.
- Bilingual Thai/English UI toggle for key screens, labels, validation, warnings, and user workflows.
- Role model for Admin, ESG Manager, Data Owner, Reviewer, and Viewer.

## Target Users

- Admin
- ESG Manager
- Data Owner
- Reviewer
- Auditor / Verifier
- ESG or carbon consultant
- Production, facility, logistics, procurement, and HR teams
- Management team reviewing GHG inventory status

## Use Cases

- Demonstrate an ESG/GHG data-entry workflow to an SME factory.
- Record monthly activity data such as electricity, diesel, LPG, refrigerants, materials, waste, water, and travel.
- Maintain an emission factor master without overwriting historical factor versions.
- Link evidence metadata to activity records before verification.
- Prepare a CFO/GHG inventory dashboard for management review.
- Identify missing evidence and data quality gaps before audit or third-party verification.
- Export activity data, calculation workbook, evidence register, and report output.

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js route handlers
- **Database:** PostgreSQL in database mode
- **ORM:** Prisma
- **Validation:** Zod
- **Charts:** Recharts
- **Exports:** ExcelJS, PDFKit, CSV routes
- **Testing:** TypeScript typecheck and calculation-engine test
- **Deployment target:** Vercel, Render, Railway, VPS, or internal server

## Project Structure

```text
/
├── README.md
├── package.json
├── .gitignore
├── .env.example
├── docs/
│   ├── overview.md
│   ├── system-flow.md
│   ├── tech-stack.md
│   ├── modules.md
│   └── screenshots/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── references/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── index.html
└── app.js
```

`index.html`, `styles.css`, and `app.js` are retained as an earlier static prototype. The active application is the Next.js app under `src/`.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Demo Mode

Demo mode works without `.env` and without PostgreSQL. The app uses sample data from the repository and is suitable for demos, portfolio review, and user walkthroughs.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

In demo mode, add/edit/delete actions show the real UI flow but do not persist changes until `DATABASE_URL` is configured.

### Database Mode

1. Copy the environment template:

```bash
copy .env.example .env
```

2. Edit `.env` and set a real PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/esg_carbon_assistant?schema=public"
NEXT_PUBLIC_APP_NAME="ESG Carbon Report Assistant"
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run migration:

```bash
npm run db:migrate
```

5. Seed demo records:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Optional for demo, required for database mode | PostgreSQL connection string used by Prisma. Do not commit real values. |
| `NEXT_PUBLIC_APP_NAME` | Optional | Public display name for the app. |

Only `.env.example` should be committed. Real `.env` files are ignored by `.gitignore`.

## Scripts

```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Screenshots

Screenshot placeholders are prepared in `docs/screenshots/`.

Recommended screenshots for a GitHub README or product deck:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/activity-data.png`
- `docs/screenshots/emission-factors.png`
- `docs/screenshots/report-page.png`
- `docs/screenshots/mobile-view.png`

## Roadmap

- **Phase 1:** Static prototype and UX direction.
- **Phase 2:** Next.js MVP, demo mode, Prisma schema, CRUD APIs, data-entry UI, bilingual UI, reports, verification workspace.
- **Phase 3:** Authentication, role-protected workflows, production file upload storage, stronger audit log views, real deployment.
- **Phase 4:** PWA/mobile-ready workflow, offline capture, Flutter/mobile app option, enterprise integrations.

## Security Notes

- This repository is designed to use demo/sample data only.
- Do not commit `.env`, real database URLs, API keys, service accounts, private tokens, customer data, employee data, internal ISO documents, internal Excel files, or real audit evidence.
- `.gitignore` excludes common secret and local build files.
- `.env.example` contains placeholders only.
- The included TGO reference PDFs should be reviewed for license/redistribution requirements before publishing a public repository.
- Authentication and production role enforcement are not implemented yet.

## License

Internal / Demo Use Only.

If this project will be open-sourced later, replace this section with an approved open-source license such as MIT, Apache-2.0, or a private commercial license.
