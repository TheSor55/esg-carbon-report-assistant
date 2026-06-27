# Phase 1 Implementation Plan

## Objective

Create a usable first prototype for an ESG Carbon Report Assistant that supports Thai and English users and establishes the main product modules before introducing a database, authentication, and document exports.

## Delivered Modules

1. Dashboard: total emissions, scope summary, site breakdown, evidence readiness.
2. Activity Data: activity records, unit, quantity, scope, site, factor mapping, evidence status.
3. Emission Factor Master: factor value, unit, source, and effective year.
4. ISO 14064-2:2019: project profile, baseline, project emissions, leakage, monitoring plan, net reductions.
5. Carbon Management Planning: baseline year, target year, reduction target, initiatives, budget, owner.
6. GHG Practitioner Workspace: QA/QC checklist, evidence review, factor review, uncertainty, verifier readiness.
7. Report Preview: ISO 14064-1, TGO CFO, ISO 14064-2, and ESG narrative summary.

## Phase 2 Backlog

- Convert static prototype to Next.js + TypeScript.
- Add PostgreSQL and Prisma schema.
- Add role-based access control.
- Add evidence file upload.
- Add Excel import/export.
- Add PDF/DOCX report generation.
- Add AI assistant workflows.
- Add verifier comment workflow.

## TGO Reference PDFs

The prototype includes local PDF references under `references/tgo/` for CFO and CFP emission factor updates from TGO. These references should be used for traceability when selecting and reviewing emission factors.
