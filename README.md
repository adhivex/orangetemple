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
```

These are local-only development defaults, not secrets. Then open http://localhost:3000 and http://localhost:3000/design-system. All commands are listed in `CLAUDE.md`.

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
