# OrangeTemple — Project Documentation (v2)

## Getting started
Requires Node.js 24 and Corepack (bundled with Node).

Requires Docker Desktop for the local database.

```bash
corepack pnpm install
corepack pnpm db:up
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

Before the database steps, create `.env.local` (gitignored) with the local Docker values from `compose.yaml`:

```
DATABASE_URL=postgresql://orangetemple:orangetemple@localhost:5433/orangetemple
DIRECT_URL=postgresql://orangetemple:orangetemple@localhost:5433/orangetemple
SEED_TARGET=development
REVALIDATE_SECRET=<any random string of 16+ characters>
```

Pages are prerendered from the database. After changing content, run `corepack pnpm db:seed`, then `corepack pnpm revalidate` while the site is running.

These are local-only development defaults, not secrets. Then open http://localhost:3000. All commands are listed in `CLAUDE.md`.

## Deploying a preview to Vercel
Until launch, deployments are previews only (D-042): every record is published, images are placeholders, and robots.txt blocks indexing. The build (`vercel.json` → `scripts/vercel-build.mjs`) applies migrations, seeds with `SEED_TARGET=preview`, then runs `next build`.

1. In Vercel, **Add New → Project** and import `adhivex/orangetemple`. Keep the detected Next.js settings; `vercel.json` sets the build command.
2. In the project settings for the Production environment, set the production branch to `production` (a branch that does not exist yet), so pushes to `main` deploy as previews.
3. From the project's **Storage** tab, create a Neon database and connect it to the project for Preview and Development. It adds `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct).
4. In the project's environment variables, for Preview: `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the pnpm version pinned in `package.json`. Optional: `NEXT_PUBLIC_CONTACT_EMAIL`. Leave `NEXT_PUBLIC_SITE_URL` unset for Preview; previews use their own branch URL.
5. Enable Web Analytics from the project's **Analytics** tab (D-021).
6. Redeploy (or push to `main`). Previews sit behind Vercel Authentication by default, so only your Vercel team can open them.

Production (Phase 11) comes after the launch criteria in `docs/PRD.md`: reviewed content, licensed images, a separate Neon branch for production, `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`, `REVALIDATE_SECRET`, then `SEED_TARGET=production pnpm db:seed` against the production database, the `orangetemple.in` domain, and switching the production branch back to `main`.

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
