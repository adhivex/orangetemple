# OrangeTemple — Architecture

## 1. High-level architecture
Browser → Next.js (App Router) → Server Components / route handlers → Prisma → PostgreSQL (Neon)

Supporting services: Cloudinary (images), Mapbox (static maps in V1), Vercel (hosting/CDN), GitHub (source and CI).

## 2. Application layers
- **Presentation:** React, TypeScript (strict), Tailwind CSS, shadcn/ui, Framer Motion.
- **Application:** Server Components by default. Client Components only for real interactivity (filter sheet, gallery lightbox, mobile navigation, share button). V1 has almost no mutations; a route handler protected by `REVALIDATE_SECRET` triggers revalidation.
- **Data:** Prisma, PostgreSQL on Neon. Validate inputs at boundaries with Zod, and validate environment variables at startup.

## 3. Content architecture
- Temple is the central entity. A temple belongs to many collections; collections reference temple IDs. Never duplicate temple records.
- **Source of truth is Git seed files** (D-002), upserted idempotently by slug via `pnpm db:seed`. The database is the runtime read model.
- Long-form content is Markdown with raw HTML disabled (D-003).
- Updating content: edit seed files → pull request → run seed against the target environment → on-demand revalidation.

## 4. Rendering and caching
- Temple, collection, explore and static pages are statically generated (`generateStaticParams`) and revalidated on demand after seeding (D-015). The Next.js caching model has changed across recent versions, so confirm the correct API for the pinned version.
- `/temples` (search and filters) renders on the server per request using query parameters, with efficient queries.
- Only published content is ever fetched for public pages.

## 5. Database and Neon
- `DATABASE_URL` is the pooled connection for runtime; `DIRECT_URL` is the direct connection for migrations.
- Use separate Neon branches for development, preview and production. Never point local or preview at the production database.
- Prisma's configuration and driver-adapter requirements have changed in recent major versions. Check the current Prisma and Neon documentation in Phase 2 and record the chosen setup in `DECISIONS.md`.
- Enable `pg_trgm` and `unaccent` via a migration.

## 6. Search
PostgreSQL trigram and `unaccent` search over `name`, `nameNative`, `alternateNames`, `city` and state name (D-014). Rank by similarity when `q` is present; otherwise sort alphabetically. Add indexes as specified in `DATABASE-SCHEMA.md`. An external search service is future scope.

## 7. Images
- Store production images in Cloudinary, never in Git. Store `publicId`, `url` and metadata in the database.
- Use a custom `next/image` loader that builds Cloudinary URLs with `f_auto`, `q_auto` and a width (D-012). Do not also route these images through Vercel's image optimizer.
- Always provide accurate `sizes`, explicit width and height (no layout shift), and a blur placeholder. Only the LCP image is `priority`; everything else is lazy.
- Roles: hero, gallery, thumbnail, og. Every image has alt text, credit and licence metadata.
- A neutral placeholder image (flagged `isPlaceholder`) is allowed in development only.

## 8. Maps
V1 uses the Mapbox Static Images API for the location card, with a public URL-restricted token, plus an "Open in Maps" deep link built from coordinates (D-013). No map GL library in V1. If an interactive map is added later, it lives on its own route and is dynamically imported. If a temple has no verified coordinates, hide the map and show the address only.

## 9. SEO
Each published temple page has: unique title and meta description (from content, overridable), canonical URL, Open Graph and Twitter metadata, social image (1200×630, designed to preview well when shared on WhatsApp), breadcrumbs, JSON-LD, sitemap entry and internal links.

- JSON-LD: `HinduTemple` (with address and geo when verified) on temple pages, `BreadcrumbList` on deeper pages, `ItemList` on collection pages, `Organization` and `WebSite` on the homepage.
- `/temples` with any search or filter parameter: `noindex, follow`, canonical to `/temples`. `?page=N` is self-canonical.
- Canonical temple URL is `/temples/[slug]` only. Collections link to it; they never duplicate it.
- Changed slugs redirect via `SlugRedirect` (308).

## 10. Performance budgets
Measured on a production build with Lighthouse mobile (throttled) and real-device checks.
- LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms
- First Load JS ≤ 200 KB gzipped on any public route; investigate anything over 150 KB
- Framer Motion via `LazyMotion` with `domAnimation` and `m` components; no autoplay video
- Font loading with `next/font`, `display: swap`, Latin subset by default; Devanagari fonts only where native text appears
- No blocking third-party scripts

## 11. Progressive web app
V1 ships `manifest.webmanifest` (name, short name, standalone display, theme and background colours, 192 and 512 icons, maskable icon), `apple-touch-icon` and `theme-color`. No service worker in V1 (D-011).

## 12. Security and privacy
- No secrets in the repository or the browser. Only `NEXT_PUBLIC_` variables reach the client.
- Set security headers in `next.config` (CSP appropriate to Cloudinary and Mapbox, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`).
- The corrections and contact flow is a `mailto:` link in V1, so there is no public write endpoint.
- Analytics: Vercel Web Analytics, cookieless (D-021).

## 13. Testing and CI
- Vitest for pure logic (slug rules, search ranking, related-temple selection, seed validation).
- Playwright smoke tests at 390×844 and 1280×800: home, directory search and filter, a temple page, both collections, explore page, 404.
- axe accessibility checks inside Playwright on key pages.
- GitHub Actions on every pull request: install, Prisma validate and generate, typecheck, lint, tests, build.

## 14. Future architecture
Interactive Mapbox map, yatra planner, search upgrade, authentication, saved temples, visit tracking, festival calendar, AI assistant over structured content, offline support, Hindi UI. None is built in V1; the model and routes leave room for them.
