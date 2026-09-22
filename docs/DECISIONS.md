# OrangeTemple — Decision Log

Newest entries win over older text elsewhere. Status is **Accepted** (settled) or **Proposed** (a recommended default; the owner should confirm before the phase that depends on it). Record every architectural change here, with the reason.

On 2026-09-23 the owner accepted all Proposed entries D-002 to D-022 as written, with one note on D-002 (below).

| ID | Decision | Reason | Status |
|---|---|---|---|
| D-001 | V1 has **15 unique temple records** (12 Jyotirlingas + 4 Char Dham, Rameshwaram shared) and 16 collection memberships. | The earlier "16 temples" was a miscount and risked a duplicate Rameshwaram record. | Accepted |
| D-002 | Content source of truth is **Git seed files**, upserted idempotently into PostgreSQL by `pnpm db:seed`. The database is the runtime read model. Revisit (admin UI or headless CMS) when non-developers must edit or the catalogue passes about 50 temples. | Simple, reviewable through pull requests, no admin to build for V1. **Owner note (2026-09-23):** fine for the launch catalogue; may need revisiting if the catalogue expands beyond the initial collections (12 Jyotirlingas + 4 Char Dham = 15 temples). | Accepted (2026-09-23) |
| D-003 | Long-form fields are stored as **Markdown** text with raw HTML disabled, rendered by one small Markdown renderer. | One justified dependency; keeps content portable. | Accepted (2026-09-23) |
| D-004 | **State** and **Region** are V1 entities (not future). | Homepage "Explore by region" and directory filters need them; free-text state names break filtering. | Accepted |
| D-005 | **Stories are removed from V1** (homepage section, navigation, model). Routes stay reserved. | Stories were in the V1 homepage but deferred in the plan and absent from the schema. | Accepted (2026-09-23) |
| D-006 | `/explore-bharat` in V1 is a **state-by-region browse page** linking to filtered directory results. The interactive map comes later. | Gives the "Sacred Bharat" entry point a real destination without a map dependency. | Accepted (2026-09-23) |
| D-007 | "Explore by deity" and "Explore by region" tiles link to filtered `/temples` URLs. **Tiles with zero published temples are hidden**, and a section with fewer than 3 tiles is hidden. | At launch Devi, Rama, Hanuman, Ganesha and Northeast have no temples; empty tiles would look broken. | Accepted (2026-09-23) |
| D-008 | Canonical collection URLs are `/jyotirlingas` and `/char-dham`, implemented as thin route wrappers around **one shared collection template**. All other collections use `/collections/[slug]`. `/collections/jyotirlingas` and `/collections/char-dham` redirect (308) to the vanity URLs. | High-value URLs for search, no hardcoded page content, no duplicate URLs. | Accepted (2026-09-23) |
| D-009 | Slug convention: plain name when it is nationally unique and iconic; `name-city` when the name is ambiguous or the site is disputed. Slugs are stable once published; changes create a `SlugRedirect`. Launch slugs are in `SEED-DATA.md`. | Thousands of temples share names like "Hanuman Temple". Slugs cannot change safely after launch. | Accepted (2026-09-23) |
| D-010 | Mobile navigation: top bar (logo, search) plus a **bottom tab bar** (Home, Temples, Explore, Search). On temple pages the bottom bar is replaced by an action bar (Directions, Share). Desktop uses a header nav. | Delivers the app-like mobile experience the product is aiming for. | Accepted (2026-09-23) |
| D-011 | V1 ships a **PWA manifest and icons** (installable). No service worker or offline mode until scoped. | Cheap now; offline is valuable for pilgrims in low-signal areas but is a separate piece of work. | Accepted (2026-09-23) |
| D-012 | Images: Cloudinary with a **custom `next/image` loader**, so images are not processed twice. | Avoids double optimization and extra Vercel image cost. | Accepted (2026-09-23) |
| D-013 | Maps in V1: **Mapbox Static Images API** for the temple location card plus an "Open in Maps" deep link. No map GL library in V1. A GL library, if used later, is dynamically imported on the map page only. | GL bundles are large and conflict with the JS budget. | Accepted (2026-09-23) |
| D-014 | Search: PostgreSQL `pg_trgm` and `unaccent` over name, native name, alternate names, city and state. No external search service in V1. | Handles transliteration variants and typos at this scale. | Accepted (2026-09-23) |
| D-015 | Rendering: static generation of temple and collection pages with **on-demand revalidation** after content changes. Verify against the pinned Next.js version's caching model. | Fast pages, content updates without redeploy. | Accepted (2026-09-23) |
| D-016 | Fonts: Fraunces (display), Inter (body), Noto Serif Devanagari and Noto Sans Devanagari for native-script text only. | Editorial look with proper Devanagari support for temple names. | Accepted (2026-09-23) |
| D-017 | Palette tokens in `DESIGN-SYSTEM.md` are chosen to meet WCAG AA text contrast. Bright saffron is used as a fill with dark text; a deeper burnt orange is used for buttons with white text and for links. | White text on bright saffron (#FF9933) is only about 2:1 and fails AA. | Accepted (2026-09-23) |
| D-018 | The collection named **Char Dham** means Badrinath, Dwarka, Puri and Rameshwaram. Its introduction must distinguish it from the Uttarakhand "Chota Char Dham" (Yamunotri, Gangotri, Kedarnath, Badrinath), a separate future collection. | Search intent for "Char Dham" often means the Uttarakhand circuit. | Accepted |
| D-019 | Temples whose site is traditionally disputed (Nageshwar, Baidyanath) carry a `locationNote`. The launch identifications are in `SEED-DATA.md` and must be confirmed by the owner. | The content rules forbid presenting disputed claims as settled fact. | Accepted (2026-09-23) |
| D-020 | Production publishing gate: `pnpm db:seed` publishes a temple in production only if its seed record is marked `reviewed: true`. Development and preview publish all records. | Stops unreviewed, AI-drafted content going live. | Accepted (2026-09-23) |
| D-021 | Analytics: Vercel Web Analytics (cookieless). No third-party tracking scripts in V1. | Privacy and performance. | Accepted (2026-09-23) |
| D-022 | V1 UI is English. Temple names carry an optional Devanagari native name. A Hindi UI is future work; do not build it in V1. | Keeps V1 scope small while staying content-ready. | Accepted (2026-09-23) |
| D-023 | **Content Security Policy without nonces**: a static policy in `next.config.ts` headers with `script-src 'self' 'unsafe-inline'`; every other directive strict (`frame-ancestors 'none'`, `object-src 'none'`, images limited to self, Cloudinary and Mapbox). | Next.js 16 applies nonces only during dynamic rendering, so a nonce CSP would disable the static generation D-015 requires. Revisit with Next.js SRI (experimental today) once stable. | Proposed |
| D-024 | Mobile top bar has a **menu button** beside search, opening the menu sheet. | DESIGN-SYSTEM.md §4 defines the menu sheet but not where it opens from; the top bar keeps the bottom tab bar to the four documented tabs. | Proposed |
| D-025 | The header search icon and the Search tab link to **`/temples#search`** (the directory with its search field). No separate `/search` route. | ROUTES.md has no search route; search lives in the directory (PRD §6). | Proposed |
| D-026 | Local development uses **PostgreSQL in Docker**; Neon (dev, preview, production branches) is set up before deployment by pointing `DATABASE_URL` / `DIRECT_URL` at it. | No Neon account yet; Docker Postgres supports `pg_trgm` and `unaccent`, so search is exercised locally. | Accepted (2026-09-23) |
| D-027 | Type scale is **fluid**: each style interpolates linearly from its mobile value at a 360 px viewport to its desktop value at 1280 px (CSS `clamp()`), instead of jumping at a breakpoint. | Hits both documented sizes exactly and avoids awkward tablet sizes. | Proposed |
| D-028 | The footer is a **dark charcoal surface** (`--charcoal-900`, ivory and sand text, saffron-500 headings; all pairings AA-tested). The site remains light-theme only. | Gives the page a firm, editorial end; uses existing tokens only. | Proposed |
| D-029 | The **logomark** (an abstract doorway arch) and wordmark are **placeholders** pending owner approval. The mark is hand-drawn geometry, not a depiction of any real temple or deity. | PWA icons and the header need a mark in Phase 0; no brand assets were supplied. | Proposed |

## Pinned versions (Phase 0, 2026-09-23)
Checked against the npm registry and each tool's bundled or official documentation. Exact versions are pinned in `package.json` (`save-exact`).

| Tool | Version | Notes |
|---|---|---|
| Node.js | 24.x (`.nvmrc`, `engines` `>=24 <25`) | Verified locally on 24.21.0. |
| pnpm | 12.5.1 | Pinned via `packageManager`, run through Corepack. pnpm 12 blocks dependency build scripts unless listed in `pnpm-workspace.yaml` `allowBuilds` (only `unrs-resolver`). |
| Next.js | 16.3.6 | Turbopack is the default bundler; `next lint` is removed (ESLint runs directly); error boundaries receive `retry()`. Caching model for D-015 to be confirmed from the bundled docs in Phase 2 (`cacheComponents` / `use cache` / `cacheTag`). |
| React, React DOM | 19.3.0 | |
| TypeScript | 6.0.3 | **Not 7.0.2** (npm latest, the Go-native compiler): typescript-eslint 8.70 supports only `<6.1.0`. Revisit when typescript-eslint supports 7. |
| Tailwind CSS | 4.3.3 (with `@tailwindcss/postcss` 4.3.3) | CSS-first configuration in `src/app/globals.css`. |
| shadcn/ui | `components.json` (new-york); CLI 4.21.0 for future `shadcn add` | Button and Sheet follow shadcn's source pattern on `radix-ui` 1.6.7, rewritten against our tokens rather than generated. |
| Framer Motion | 13.4.1 | `LazyMotion` + async `domAnimation` + `m`, `strict`. |
| ESLint | 9.39.5 | **Not 10.x**: eslint-plugin-react, -import and -jsx-a11y (used by eslint-config-next 16.3.6) support ESLint up to 9. |
| Others | eslint-config-next 16.3.6, Prettier 3.9.8, Vitest 5.0.1, Zod 4.6.5, lucide-react 1.47.0, sharp 0.35.4 (icon script only) | |
| Prisma | *Phase 2* | npm's `latest` tag currently points to **8.0.0-rc.15, a release candidate**; the latest stable is 7.10.0. Pin a stable release in Phase 2 after reading the Prisma and Neon driver-adapter docs. |

## Open items to confirm before Phase 2
1. Final launch slugs and working temple names (`SEED-DATA.md`).
2. Launch identification of Nageshwar and Baidyanath, and whether Bhimashankar and Grishneshwar need a `locationNote`.
3. Devanagari native names (candidates in `SEED-DATA.md`).
4. Contact email for corrections (`NEXT_PUBLIC_CONTACT_EMAIL`).
5. Hero and gallery image sourcing: who supplies images, under what licence, and credit text.
6. Whether to use Mapbox static maps in V1 or only "Open in Maps" links.
7. Accounts ready: GitHub, Vercel, Neon, Cloudinary, Mapbox (if used).
