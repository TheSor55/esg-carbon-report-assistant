# Phase 2 Architecture

## Application Layers

- `src/app`: Next.js routes, pages, and export APIs.
- `src/components`: shared shell, cards, status pills, and chart components.
- `src/lib`: domain types, sample data, unit conversion, calculation engine, report generator, exporters, access control.
- `prisma`: PostgreSQL schema and seed script.
- `public/references/tgo`: TGO PDF references served by the app.

## Accounting Controls

- Activity records preserve original quantity and unit.
- Calculation results preserve emission factor ID and version.
- Emission factor master uses immutable versioned records.
- Report generator includes boundary, methodology, assumptions, exclusions, inventory summary, hotspots, evidence register, and verification readiness.
- Calculation runs are modeled in Prisma to prevent historical results from being overwritten.

## Next Implementation Step

Phase 2.2 connects the core read UI and export routes to PostgreSQL through Prisma, with sample-data fallback for local prototype use. It also adds CRUD API routes for activity data and emission factors, plus database-backed evidence metadata registration.

## Next Implementation Step

Phase 2.3 adds real data-entry UI for activity records, emission factors, evidence metadata, organization boundary, facilities, and departments. Demo mode remains read-only for persistence; database mode uses the Prisma API routes and writes audit log entries for mutations and recalculations.

## Next Implementation Step

Add authenticated role-based access around the CRUD screens, then integrate production evidence file storage.
