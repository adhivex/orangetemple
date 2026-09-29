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
Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui, Framer Motion, Supabase (PostgreSQL through supabase-js, D-043), Cloudinary, Mapbox (static images only in V1), Vercel, GitHub, pnpm, Node.js 24.

Pin exact versions in Phase 0 after checking each tool's current documentation. Next.js caching, Supabase keys and connection modes, and Tailwind/shadcn setup have changed across recent releases. Record the pinned versions in `docs/DECISIONS.md`.

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

pnpm db:up          # start the local Supabase stack in Docker (API :54321, DB :54322, Studio :54323)
pnpm db:reset       # rebuild the local database from supabase/migrations
pnpm db:deploy      # apply Supabase migrations to a hosted database (scripts/db-push.mjs)
pnpm db:seed        # upsert the content/ seed files into Supabase (SEED_TARGET decides publishing)
pnpm db:types       # regenerate src/lib/database.types.ts after a schema change
pnpm revalidate     # refresh cached pages after seeding (needs REVALIDATE_SECRET)
pnpm test:e2e       # Playwright smoke, axe, keyboard and link checks at 390 and 1280 px
                    # (needs a build and the database; reuses a running server on :3000;
                    # PW_CHANNEL=msedge uses installed Edge instead of downloading Chromium)
```

The internal `/design-system` preview was removed before Phase 11; the review boards from it are no longer served.

## Environment variables
Names only, in `.env.example`. Never commit values.

```
SUPABASE_URL                        # Supabase project URL (D-043)
SUPABASE_PUBLISHABLE_KEY            # server-side reads; Row Level Security applies
SUPABASE_SECRET_KEY                 # seed and upload scripts only, server-side
POSTGRES_URL_NON_POOLING            # session connection for migrations
SUPABASE_DB_URL                     # optional migration override (Session pooler URL)
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


## Design (approved v1 — "Premium Saffron")

### Platform priority (applies to every decision)

1. **Mobile web**: the primary product. Most visitors are on phones, often on slow networks at
   pilgrimage sites.
2. **Tablet web**: second. Touch-first, both orientations.
3. **Desktop web**: third. Must look premium, but never at the cost of mobile.

What this means in practice:
- Write CSS mobile-first: unprefixed Tailwind classes are the phone layout; add `tablet:`,
  `tablet-lg:` and `desktop:` variants on top (breakpoints are defined in `code/tokens.css`).
  Never write desktop styles first and override them down.
- Build and verify every section on a phone (390px) before touching tablet, and on tablet before
  desktop.
- When requirements conflict, mobile wins, then tablet. Examples: image weight is budgeted for
  4G phones; interactions are designed for touch first and hover is an enhancement; nothing
  important may exist only in the desktop layout.
- Performance and Lighthouse targets are measured on mobile first.

### Design rules

The visual design is final for the first live version. Build to it; do not invent a new look.

- Read before any UI work: `docs/design/DESIGN_SYSTEM.md`, `docs/design/HOMEPAGE_SPEC.md`,
  `docs/design/COMPONENTS.md`, `docs/design/ASSETS.md`.
- Visual source of truth: `docs/design/reference/orangetemple-home.html` (open in a browser)
  and the screenshots `docs/design/reference/homepage-desktop.jpg` / `homepage-mobile.jpg`.
- Tokens: `docs/design/code/tokens.css` merged into `src/app/globals.css`. Use the named
  Tailwind colours (`saffron`, `gold`, `ink`, `surface`, `line`, …). No raw hex values in
  components.
- Fonts: Cormorant Garamond (headings) + DM Sans (body) via `next/font`, see
  `docs/design/code/fonts.ts`.
- Icons: use `docs/design/code/icons.tsx` (copied to `src/components/icons`). Use lucide-react
  only for generic UI icons that are not in this set.
- Images: interim photos live in `public/images/`. Always use `next/image`. Temples without a
  photo show the placeholder card; never reuse another temple's photo.
- Mobile-first: implement the phone layout as its own design (stats panel, rails, tab bar),
  then enhance for tablet and desktop.
- Motion: only the hero settle animation + hover transitions. Honour
  `prefers-reduced-motion`.
- Cream theme only: no dark mode. The page stays cream (#FBF1E5) even when the device is in
  dark mode. Don't add `dark:` styles, a theme switcher or next-themes.
- Features marked "coming soon" in the spec (sign-in, interactive map, extra deities) show a
  toast in v1. Do not build them yet.
- Cookie consent is required: no analytics or marketing script loads before the visitor opts in
  (see "Cookie consent" in HOMEPAGE_SPEC.md). Use `ConsentGate` for any such script.
- Footer credit "Designed & Developed by OrangeKite" links to https://orangekite.in/ and must
  stay on every page.
- Mobile and tablet: follow `docs/design/MOBILE_WEBAPP.md` (tablet rules in section 6) (installable PWA, offline fallback,
  44px tap targets, 16px inputs, hover only on hover-capable devices, bottom-sheet menu,
  full-screen mobile search, safe areas, svh/dvh units). Never disable pinch-zoom.
