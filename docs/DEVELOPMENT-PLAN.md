# OrangeTemple — Development Plan

Phases are numbered 0–11, with Phase 12 as future scope. Complete and validate each phase before starting the next. Every phase ends with the quality gate (typecheck, lint, tests, production build, and a visual check at 390 px and 1280 px) and a report in the format defined in `AI-CODING-RULES.md`.

**Review gates** (stop and wait for the owner): after Phase 1, after Phase 2, after Phase 6, and before Phase 11. At other phases, continue unless a documented decision must change.

## Phase 0 — Foundation
- Initialize Next.js (App Router), TypeScript strict, Tailwind, shadcn/ui, Framer Motion, ESLint, Prettier
- pnpm, Node 24, `.env.example`, environment validation, Git setup, GitHub Actions CI
- Base layout, security headers, `/manifest.webmanifest`, branded 404 and error pages
- Pin versions and record them in `DECISIONS.md`; fill in the Commands section of `CLAUDE.md`

**Done when:** a clean clone runs `pnpm install && pnpm dev`; CI is green; the pinned versions are recorded.

## Phase 1 — Design system (review gate)
- Tokens from `DESIGN-SYSTEM.md`, fonts, responsive containers
- Buttons, cards, section header, header, footer, mobile bottom nav, menu sheet, bottom sheet, action bar
- Motion patterns with `LazyMotion` and reduced-motion support
- A simple internal component preview route (not indexed, removed before production)

**Done when:** every component renders correctly at 360, 390, 430, 768, 1024 and 1440 px; contrast meets AA; keyboard and focus work.

## Phase 2 — Database and seed (review gate)
- Neon (dev, preview, production branches), Prisma, migrations including `pg_trgm` and `unaccent`
- Schema per `DATABASE-SCHEMA.md`; seed per `SEED-DATA.md` (Level 1 content, `reviewed` flag)
- Seed validation test

**Done when:** `pnpm db:migrate && pnpm db:seed` works twice with no duplicates; 15 temples, 2 collections, Rameshwaram exactly once and in both collections; owner has reviewed the seed content and identifications.

## Phase 3 — Core components
TempleCard, CollectionCard, Hero, SectionHeader, Gallery and lightbox, filter controls, search UI, Breadcrumbs, RelatedTemples, VisitInformation, QuickFacts, Markdown renderer, Cloudinary image loader, image fallback.

**Done when:** components are typed, accessible, responsive, and use only database-shaped props.

## Phase 4 — Homepage
Hero, introduction, Jyotirlingas, Char Dham, deity and region tiles (dynamic, hidden when empty), Sacred Bharat entry point, footer.

**Done when:** homepage is fully database-driven, works at 360 px, and meets the LCP budget on a throttled mobile run.

## Phase 5 — Temple directory
`/temples` with search, filters, bottom-sheet filters on mobile, server pagination, empty, loading and error states, and `noindex` rules.

**Done when:** searching "Varanasi", "Rameswaram" and a typo such as "Kedarnat" finds the right temples; filters combine correctly; URLs are shareable.

## Phase 6 — Temple detail (review gate)
`/temples/[slug]` with all sections, hidden-when-empty behaviour, quick facts, visit information with verification notice, gallery, nearby places, related temples, references, action bar (Directions, Share), static map card.

**Done when:** all 15 temples render from the one template; invalid slugs 404 or redirect; no section shows filler text.

## Phase 7 — Collections
`/jyotirlingas` and `/char-dham` via the shared template, redirects from `/collections/...`, `/explore-bharat`, `/about`, `/contact`, `/credits`, `/privacy`.

**Done when:** collection pages link to canonical temple URLs only; Rameshwaram appears in both.

## Phase 8 — SEO
Metadata, Open Graph and social images, canonical URLs, sitemap, robots, breadcrumbs, JSON-LD (`HinduTemple`, `BreadcrumbList`, `ItemList`), internal linking, slug redirects.

**Done when:** structured data validates; filtered directory URLs are `noindex`; share previews look correct.

## Phase 9 — Performance
Image optimization review, JS budget check, font loading, LCP and CLS measurement on a production build, throttled mobile testing.

**Done when:** budgets in `ARCHITECTURE.md` are met and recorded.

## Phase 10 — Quality
Playwright smoke tests, axe checks, keyboard pass, responsive testing, broken-link check, error-state review, content review of every temple.

**Done when:** all tests pass in CI; no critical accessibility issues; every launch temple is reviewed.

## Phase 11 — Production (review gate before starting)
GitHub repository, Vercel project, `orangetemple.in` domain, production environment variables, production seed with `SEED_TARGET=production`, analytics, sitemap submission, production smoke test.

**Done when:** launch criteria in `PRD.md` are met on the live site.

## Phase 12 — Future roadmap (only after V1 is stable)
State and region pages, Stories, festival calendar, interactive map, yatra planner, offline mode, Hindi UI, accounts, saved and visited temples, AI assistant.

## Delivery rule
Do not build future features early. Do not move past a phase until its "done when" is true.
