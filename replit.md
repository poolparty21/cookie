# CookieLite — GDPR Cookie Consent Manager

The simplest, most affordable GDPR cookie consent banner for EU businesses. €7/month — half the price of Cookiebot.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/gdpr-consent run dev` — run the frontend (port varies)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-products` — create CookieLite product in Stripe (run once after Stripe is connected)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, react-helmet-async (SEO), Tailwind CSS, shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Payments: Stripe + stripe-replit-sync
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/users.ts` — users table (stores Stripe customer/subscription IDs)
- `artifacts/gdpr-consent/src/` — React frontend (landing page, checkout, success, privacy)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/stripeClient.ts` — Stripe client (uses Replit connector)
- `artifacts/api-server/src/storage.ts` — queries stripe.* tables from PostgreSQL
- `scripts/src/seed-products.ts` — creates CookieLite €7/month product in Stripe

## Architecture decisions

- Stripe data is stored in the `stripe.*` schema (managed by stripe-replit-sync) — no duplicate product tables
- Webhook route is registered BEFORE `express.json()` so the body remains a raw Buffer for signature verification
- Products/prices are queried from the synced `stripe.products` and `stripe.prices` tables — no Stripe API calls on every request
- stripe-replit-sync handles webhook setup, schema migration, and backfill automatically on startup

## Product

CookieLite is a GDPR Cookie Consent Manager SaaS for small EU businesses. Landing page targets keywords: "GDPR cookie banner free", "cheapest GDPR cookie consent". Priced at €7/month — half the cost of Cookiebot (€14+).

Pages:
- `/` — SEO-optimized landing page with hero, pricing, features, FAQ, checkout form
- `/success` — post-checkout thank you page
- `/privacy` — privacy policy

## User preferences

- Dotted frame as brand signature throughout the UI
- Super simplistic and SEO-conformant design
- Unique style to stand out from competitors

## Gotchas

- Run `pnpm --filter @workspace/scripts run seed-products` once after Stripe is connected to create the product
- Stripe Stripe integration must be connected via the Integrations tab before starting the server (otherwise initStripe logs a warning and payments won't work)
- After any OpenAPI spec change, always re-run codegen before editing routes or frontend code
- The `stripe` schema in PostgreSQL is managed by stripe-replit-sync — never create tables there manually

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
