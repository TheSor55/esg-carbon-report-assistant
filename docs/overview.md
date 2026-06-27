# Project Overview

## Purpose

ESG Carbon Report Assistant is a web application for collecting, reviewing, calculating, and reporting greenhouse gas activity data for SME factories and ESG teams.

The system is designed around ISO 14064-1, TGO Carbon Footprint for Organization (CFO) practices, GHG inventory workflows, evidence readiness, and management dashboard review.

## Problem

Many SME organizations still manage carbon data through scattered spreadsheets, email evidence, and manually maintained emission factor tables. This creates common problems:

- unclear data ownership
- missing evidence before verification
- emission factors overwritten without version history
- difficult audit trail for calculations
- slow management review
- inconsistent report structure

## Target Users

- Admin
- ESG Manager
- Data Owner
- Reviewer
- Auditor / Verifier
- Carbon consultant
- Production, facility, procurement, logistics, HR, and management teams

## System Scope

The current MVP covers:

- organization and boundary setup
- facility and department master data
- reporting period and base year setup
- activity data records
- emission factor master and version preservation
- evidence metadata register
- calculation preview and calculation traceability
- dashboard and hotspot review
- ESG/GHG structured report page
- verification readiness workspace
- CSV, Excel, and report export endpoints
- demo mode fallback without a database
- database mode with PostgreSQL and Prisma

## Out of Scope For Current MVP

- login and authentication screens
- full production RBAC enforcement
- real file upload storage
- external evidence storage integrations
- deployed production infrastructure
- automated email notification workflow
- mobile offline capture

These items are suitable for the next release phase.
