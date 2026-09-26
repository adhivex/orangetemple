# OrangeTemple — Claude Project Instructions

## Project
OrangeTemple.in is a mobile-first digital platform for discovering the temples, pilgrimage destinations, traditions and sacred heritage of Bharat.

V1 launches with **15 unique temples**: the 12 Jyotirlingas and the 4 Char Dham. Rameshwaram belongs to both collections, so there are 16 collection memberships but only 15 temple records. The platform must scale to hundreds or thousands of temples without architectural rewrites.

## Document map and precedence
Read the relevant document before working in its area.

| Document | Governs |
|---|---|
| `docs/DECISIONS.md` | Product and architecture decisions. The newest entry wins over older text elsewhere. |
| `docs/PRD.md` | V1 scope, requirements, non-goals, launch criteria |
| `docs/ARCHITECTURE.md` | Rendering, caching, images, maps, search, SEO, performance budgets, testing |
| `docs/DATABASE-SCHEMA.md` | Entities, fields, enums, constraints, indexes |
| `docs/CONTENT-MODEL.md` | Content rules, page-section-to-field mapping, sourcing and review |
| `docs/ROUTES.md` | URLs, query parameters, canonical and robots rules |
| `docs/DESIGN-SYSTEM.md` | Tokens, typography, components, mobile patterns, accessibility |
| `docs/SEED-DATA.md` | The 15 launch temples, states, deities, collections, seeding rules |
| `docs/DEVELOPMENT-PLAN.md` | Phases, "done when" criteria, review gates |
| `docs/AI-CODING-RULES.md` | Coding, dependency, testing and workflow rules |

If documents conflict, or something is ambiguous or undecided: stop, ask, then record the answer in `docs/DECISIONS.md`. Do not silently pick an interpretation.

## Core principles
- One responsive codebase. Mobile is the primary design reference (360, 390 and 430 px), then tablet, desktop, large desktop. Never build separate mobile and desktop apps.
- Database-driven content. Never hardcode temple pages or temple content in components; one template renders every temple.
- One record per temple. Collections reference temples (many-to-many).
- SEO-first, fast, accessible.
- Simplest solution that works. No dependency without a stated reason.
- Preserve working functionality. Document architectural changes in `docs/DECISIONS.md`.

## Hard content rules
- Never fabricate temple facts, timings, coordinates, URLs, references, statistics or image credits. If a value is unknown, leave it empty (`docs/CONTENT-MODEL.md` says how empty fields render).
- Keep documented history separate from traditional legends. Never present a legend as verified history.
- Visit information is time-sensitive: it carries a last-verified date and a source.
- No AI-generated imagery of temples or deities.

## Stack
Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui, Framer Motion, PostgreSQL on Neon, Prisma, Cloudinary, Mapbox (static images only in V1), Vercel, GitHub, pnpm, Node.js 24.

Pin exact versions in Phase 0 after checking each tool's current documentation. Next.js caching, Prisma configuration and driver adapters, and Tailwind/shadcn setup have changed across recent releases. Record the pinned versions in `docs/DECISIONS.md`.

## Commands
pnpm is pinned via `packageManager` and run through Corepack. On Windows, `corepack enable` needs an administrator shell; without it, prefix commands with `corepack` (for example `corepack pnpm dev`).

```
pnpm dev            # dev server (Turbopack) on http://localhost:3000
pnpm build          # production build
pnpm start          # serve the production build
pnpm lint           # ESLint 9 flat config, zero warnings allowed
pnpm typecheck      # tsc --noEmit (strict)
pnpm test           # Vitest unit tests in tests/unit
pnpm format         # Prettier write (format:check in CI)
pnpm icons          # regenerate PWA icons and favicon from the logomark

pnpm db:up          # start local Postgres 17 in Docker (compose.yaml, port 5433)
pnpm db:migrate     # create/apply migrations (prisma migrate dev)
pnpm db:deploy      # apply migrations only (preview/production)
pnpm db:seed        # upsert seed files into the database (SEED_TARGET decides publishing)
pnpm db:generate    # regenerate the Prisma client (also runs on postinstall)
pnpm db:studio      # browse the database
pnpm revalidate     # refresh cached pages after seeding (needs REVALIDATE_SECRET)
pnpm test:e2e       # Playwright smoke, axe, keyboard and link checks at 390 and 1280 px
                    # (needs a build and the database; reuses a running server on :3000;
                    # PW_CHANNEL=msedge uses installed Edge instead of downloading Chromium)
```

The internal `/design-system` preview was removed before Phase 11; the review boards from it are no longer served.

## Environment variables
Names only, in `.env.example`. Never commit values.

```
DATABASE_URL                        # Neon pooled connection (runtime)
DIRECT_URL                          # Neon direct connection (migrations)
NEXT_PUBLIC_SITE_URL                # https://orangetemple.in
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY                  # upload scripts only, server-side
CLOUDINARY_API_SECRET               # upload scripts only, server-side
NEXT_PUBLIC_MAPBOX_TOKEN            # public, URL-restricted token
REVALIDATE_SECRET                   # protects the revalidation endpoint
NEXT_PUBLIC_CONTACT_EMAIL           # corrections and contact
SEED_TARGET                         # development | preview | production
```

## Quality gate
After each meaningful milestone run typecheck, lint, tests and a production build, and check the result at 390 px and 1280 px. Fix errors you caused before continuing.
