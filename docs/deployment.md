# Deployment Guide

## Deployment Options

This repository contains two usable surfaces:

1. **GitHub Pages static demo**
   - Uses `index.html`, `styles.css`, `app.js`, and `demo-entry.js`.
   - Runs directly on GitHub Pages.
   - Supports demo activity data entry with browser `localStorage`.
   - Data is stored only on the current browser/device.
   - No shared database, no API, and no authentication.

2. **Next.js MVP application**
   - Uses the active app under `src/`.
   - Supports CRUD UI, API routes, Prisma-ready data layer, demo mode, and database mode.
   - Requires a server-capable host such as Vercel, Render, Railway, VPS, or an internal server.
   - Requires PostgreSQL for shared real data entry.

## GitHub Pages Demo Deployment

GitHub Pages is suitable for portfolio/demo use.

Recommended GitHub Pages settings:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Demo URL format:

```text
https://<github-username>.github.io/<repository-name>/
```

Current demo entry behavior:

- Users can add activity records from the Activity Data page.
- Dashboard totals update immediately.
- Activity rows are saved to browser `localStorage`.
- Users can delete custom rows or reset custom demo data.
- Data is not shared with other users.
- Data is not saved to PostgreSQL.

## Production-Like Data Entry Deployment

For real shared data entry, deploy the Next.js application and connect PostgreSQL.

Minimum requirements:

- Next.js server-capable hosting
- PostgreSQL database
- `DATABASE_URL` environment variable
- Prisma migration
- Seed or real master data

Example setup flow:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
```

Required environment variable:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/esg_carbon_assistant?schema=public"
```

Optional:

```env
NEXT_PUBLIC_APP_NAME="ESG Carbon Report Assistant"
```

## Recommended Hosting

### Vercel

Best fit for Next.js deployment.

High-level steps:

1. Import the GitHub repository into Vercel.
2. Set framework preset to Next.js.
3. Add `DATABASE_URL`.
4. Run Prisma migration against the production database.
5. Deploy.

### Render / Railway

Suitable if you want web service + managed PostgreSQL in one platform.

High-level steps:

1. Create PostgreSQL database.
2. Create web service from GitHub repository.
3. Set build command:

```bash
npm install && npm run db:generate && npm run build
```

4. Set start command:

```bash
npm run start
```

5. Add `DATABASE_URL`.

## Current Production Gaps

Before using this as a real production system, add:

- authentication
- role-based access control enforcement
- production file upload storage
- audit log UI
- database backup policy
- deployment secrets management
- monitoring and error logging
- privacy review for real company data

## Summary

- Use **GitHub Pages** for public demo and portfolio.
- Use **Next.js hosting + PostgreSQL** for real shared data entry.
- Do not use GitHub Pages alone for production data collection.
