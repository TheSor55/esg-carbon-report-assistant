# Modules

## Dashboard

Shows total emissions, scope totals, monthly trend, category chart, site summary, hotspot ranking, data completeness, and missing evidence.

## Organization And Boundary

Maintains organization name, reporting year, base year, consolidation approach, organizational boundary, operational boundary, facilities, departments, assumptions, and exclusions.

## Activity Data

Supports add, edit, delete UI for activity records. It validates required fields, checks duplicates, previews tCO2e, and preserves quantity, unit, evidence reference, responsible person, data quality, status, EF ID, and EF version.

## Emission Factor Master

Stores emission factors as versioned records. Metadata-only edits are allowed, but EF value changes should create a new version to preserve historical calculation traceability.

## Evidence Register

Stores metadata for evidence linked to activity records. The current MVP supports URL and metadata storage, not production file upload.

## Reports

Displays a structured ESG/GHG report with organization profile, boundary, methodology, inventory summary, significant emissions sources, evidence register summary, assumptions, exclusions, and verification readiness.

## Verification

Provides a readiness workspace with checklist, calculation audit trail, data gap report, and change log notes.

## API And Exports

Includes CRUD routes for activity data, emission factors, evidence, organization, facilities, and departments. Export routes provide CSV, Excel workbook, evidence register, and report output.

## Bilingual UI

The app includes an EN/TH toggle for user-facing labels, navigation, validation, warnings, and key page text.
