# OrangeTemple — Project Documentation (v2)

## Getting started
Requires Node.js 24 and Corepack (bundled with Node).

Requires Docker Desktop for the local Supabase stack (D-043).

```bash
corepack pnpm install
corepack pnpm db:up      # local Supabase: Postgres, API, Storage and Studio (http://127.0.0.1:54323)
corepack pnpm db:reset   # applies supabase/migrations to the local database
corepack pnpm db:seed
corepack pnpm dev
```

Before seeding, create `.env.local` (gitignored). `node scripts/local-supabase-env.mjs` prints the Supabase lines for the local stack:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=<"Publishable" key from supabase status>
SUPABASE_SECRET_KEY=<"Secret" key from supabase status>
POSTGRES_URL_NON_POOLING=postgresql://postgres:postgres@127.0.0.1:54322/postgres
SEED_TARGET=development
REVALIDATE_SECRET=<any random string of 16+ characters>
```

Pages are prerendered from the database. After changing content, run `corepack pnpm db:seed`, then `corepack pnpm revalidate` while the site is running. After changing the schema, run `corepack pnpm db:types` to regenerate `src/lib/database.types.ts`.

These are local-only development defaults, not secrets. Then open http://localhost:3000. All commands are listed in `CLAUDE.md`.

Temple content lives in `content/` (one file per temple in `content/temples/`).

## Deploying a preview to Vercel
Until launch, deployments are previews only (D-042): every record is published, images are placeholders, and robots.txt blocks indexing. The build (`vercel.json` → `scripts/vercel-build.mjs`) applies the Supabase migrations (`scripts/db-push.mjs`), seeds with `SEED_TARGET=preview`, then runs `next build` (D-043).

1. In Vercel, **Add New → Project** and import `adhivex/orangetemple`. Keep the detected Next.js settings; `vercel.json` sets the build command.
2. In the project settings for the Production environment, set the production branch to `production` (a branch that does not exist yet), so pushes to `main` deploy as previews.
3. From the project's **Storage** tab, create a Supabase project and connect it to the Vercel project for Preview and Development. The integration adds `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` and `POSTGRES_URL_NON_POOLING`, among others. The app reads with the publishable key; the build uses the connection string for migrations and the secret key for seeding.
4. In the project's environment variables, for Preview: `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the pnpm version pinned in `package.json`. Optional: `NEXT_PUBLIC_CONTACT_EMAIL`. Leave `NEXT_PUBLIC_SITE_URL` unset for Preview; previews use their own branch URL.
5. Enable Web Analytics from the project's **Analytics** tab (D-021).
6. Redeploy (or push to `main`). Previews sit behind Vercel Authentication by default, so only your Vercel team can open them.

If the build stops at `supabase db push` with a connection error, the connection string is probably Supabase's direct connection, which is IPv6-only unless the IPv4 add-on is enabled. Copy the **Session pooler** connection string from the Supabase dashboard (**Connect**) into a Preview environment variable named `SUPABASE_DB_URL`; the build uses it instead.

Production (Phase 11) comes after the launch criteria in `docs/PRD.md`: reviewed content, licensed images, a separate Supabase project for production (D-043), `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`, `REVALIDATE_SECRET`, then `SEED_TARGET=production pnpm db:seed` against the production database, the `orangetemple.in` domain, and switching the production branch back to `main`.

## Documentation

Source-of-truth documentation for building OrangeTemple.in with Claude Code.

Start with `CLAUDE.md` (loaded automatically by Claude Code), then `docs/DECISIONS.md`.

## Contents
- `CLAUDE.md` — project instructions, document map, hard rules, commands
- `MASTER-PROMPT.md` — the prompt to paste into Claude Code to start the build
- `docs/DECISIONS.md` — decision log and open items to confirm
- `docs/PRD.md` — scope, requirements, launch criteria
- `docs/ARCHITECTURE.md` — technical architecture and budgets
- `docs/DATABASE-SCHEMA.md` — data model
- `docs/CONTENT-MODEL.md` — content rules and section-to-field mapping
- `docs/ROUTES.md` — URLs, filters, canonical and robots rules
- `docs/DESIGN-SYSTEM.md` — tokens, typography, mobile patterns
- `docs/SEED-DATA.md` — the 15 launch temples and seeding rules
- `docs/DEVELOPMENT-PLAN.md` — phases with exit criteria and review gates
- `docs/AI-CODING-RULES.md` — engineering rules

Last updated: 2026-09-22
