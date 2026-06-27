# System Flow

## High-Level Workflow

```text
Open App
  -> Select language (EN/TH)
  -> Review dashboard
  -> Configure organization and boundary
  -> Maintain emission factor master
  -> Input activity data
  -> Link evidence metadata
  -> Review calculation preview and warnings
  -> Check verification readiness
  -> Generate report and exports
```

## Demo Mode Flow

```text
No DATABASE_URL configured
  -> Load sample organization, sites, departments, activities, factors, and verification items
  -> Render dashboard and all pages
  -> Allow users to open CRUD forms and see validation/preview behavior
  -> Block persistence with demo-mode messages
```

Demo mode is intended for portfolio review, client demonstration, training, and MVP walkthroughs.

## Database Mode Flow

```text
DATABASE_URL configured
  -> Prisma connects to PostgreSQL
  -> Seed or migrate database
  -> CRUD APIs persist activity data, emission factors, evidence metadata, organization, facilities, and departments
  -> Calculation results store activity ID, EF ID, EF version, quantity, unit, kgCO2e, tCO2e, and calculation version
  -> Mutations record audit log entries
  -> Dashboard and reports update from database-backed records
```

## Activity Data Workflow

```text
Add Activity Record
  -> Enter month, site, department, activity type, scope, category, quantity, unit, EF, evidence, owner, quality, status
  -> Validate required fields
  -> Check duplicate period/site/activity
  -> Preview tCO2e
  -> Warn when EF is demo, pending review, or expired
  -> Save through API in database mode
  -> Store/recalculate result
  -> Refresh dashboard and table
```

## Emission Factor Workflow

```text
Add Emission Factor
  -> Enter code, name, activity type, gas, unit, kgCO2e/unit, source, year, version, effective date, verification status
  -> Save as a versioned record

Edit Metadata
  -> Allow expiry date, note, verification status, active/inactive updates
  -> Do not overwrite historical factor value

Create New Version
  -> Copy existing metadata
  -> Enter new version and value
  -> Preserve historical EF versions and historical calculation results
```

## Evidence Workflow

```text
Add Evidence Metadata
  -> Link to activity record
  -> Enter evidence type, name, URL, document date, data period, owner, status, comments, note
  -> Save metadata in database mode
  -> Use evidence status in verification readiness
```

Actual file upload is intentionally out of scope for the MVP.

## Report And Verification Workflow

```text
Review Dashboard
  -> Check hotspots and missing evidence
  -> Open Verification workspace
  -> Review checklist, data gaps, and calculation audit trail
  -> Open Reports
  -> Export report and evidence register
```
