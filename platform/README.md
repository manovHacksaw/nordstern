# NordStern — Platform (Control Plane)

The multi-tenant SaaS for NordStern **Anchor OS** — where organizations register,
manage members, and (later) provision Stellar anchors. This is the **Control Plane**;
`../anchor-service/` is the **Data Plane** (the anchor provisioning engine it will
call in a later phase).

## Layout
- `api/` — TypeScript + Express (clean-layered) + Drizzle ORM + PostgreSQL.
- `console/` — Next.js 16 console (shadcn/ui, RHF+Zod, TanStack Query). *(added in a later phase)*

## Decisions (DL-010)
- **Language: TypeScript** (Express), not FastAPI — chosen to stay one language and
  reuse patterns from the existing control-plane. Supersedes the FastAPI proposal.
- **ORM: Drizzle + drizzle-kit** migrations (SQL-first, fully typed) in place of
  SQLAlchemy/Alembic. **Validation: Zod** in place of Pydantic.
- **Auth: access + rotating refresh tokens in httpOnly cookies + a sessions table.**
- **Multi-tenancy: shared DB, `organization_id` on every tenant-owned row,** enforced
  by a central tenant guard + scoped repositories.
- **Home: new top-level `platform/`**, separate from `anchor-service/` (3-plane split).

## Phase status
- ✅ Phase 1 — Analysis · ✅ Phase 2 — Architecture · ✅ Phase 3 — Database (this)
- ⬜ Phase 4 — Backend · ⬜ Phase 5 — Console · ⬜ 6 Wire · 7 Auth · 8 Onboarding · 9 Dashboard · 10 Tests

## Dev
```bash
cd platform/api
cp .env.example .env
npm install
npm run db:generate   # emit SQL migration from the Drizzle schema
npm run db:migrate    # apply to DATABASE_URL
```
