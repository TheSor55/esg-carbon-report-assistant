# Tech Stack

## Application Framework

- **Next.js 14 App Router**
  - Used for the web UI, server-rendered pages, route handlers, and deployment flexibility.

## Language

- **TypeScript**
  - Used across pages, components, data models, calculation logic, and API route validation.

## Frontend

- **React**
  - Used for interactive CRUD forms, bilingual language provider, modals/inline form behavior, and dashboard components.

- **Tailwind CSS**
  - Used for fast, consistent UI styling without introducing a heavier component framework.

## Backend

- **Next.js Route Handlers**
  - Used for CRUD APIs and export endpoints.

- **Zod**
  - Used to validate request payloads for API routes.

## Database And ORM

- **PostgreSQL**
  - Target database for production/database mode.

- **Prisma**
  - Provides the schema, generated client, migrations, and seed workflow.

## Charts And Exports

- **Recharts**
  - Used for dashboard charts.

- **ExcelJS**
  - Used for calculation workbook export.

- **PDFKit / HTML report output**
  - Used as a foundation for structured report exports.

## Data Modes

- **Demo mode**
  - Runs without a database using in-repository sample data.
  - Suitable for demos and portfolio review.

- **Database mode**
  - Runs with `DATABASE_URL`.
  - Persists CRUD data through Prisma and PostgreSQL.

## Deployment Options

The project can be deployed to:

- Vercel
- Render
- Railway
- VPS or internal server
- Docker-based infrastructure in a later phase

For real multi-user use, deploy with PostgreSQL, environment variables, authentication, and backup policies.
