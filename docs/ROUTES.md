# OrangeTemple — Route Map

## 1. V1 public routes
| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/temples` | Directory with search and filters |
| `/temples/[slug]` | **Canonical** temple page (the only URL for a temple) |
| `/jyotirlingas` | Canonical 12 Jyotirlingas collection |
| `/char-dham` | Canonical Char Dham collection |
| `/collections/[slug]` | All other collections (future) |
| `/explore-bharat` | State-by-region browse page |
| `/about` | About OrangeTemple |
| `/contact` | Corrections and contact (`mailto:` link) |
| `/credits` | Image and source attributions |
| `/privacy` | Privacy notice |

System routes: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, a branded 404 (`not-found`), a branded error page, and a protected revalidation route handler (`noindex`, never linked).

## 2. Collections (D-008)
`/jyotirlingas` and `/char-dham` are thin route files that render the one shared collection template for their slug. `/collections/jyotirlingas` and `/collections/char-dham` redirect (308) to the canonical vanity URLs. Future collections use `/collections/[slug]`.

## 3. Directory query parameters
`/temples?q=&deity=&state=&region=&collection=&page=`

- `deity`, `state`, `collection`: slugs
- `region`: lowercase region name (`north`, `south`, `east`, `west`, `central`, `northeast`)
- `page`: 1-based; 24 results per page; pagination uses real links
- Homepage tiles and `/explore-bharat` link to these URLs. Invalid parameter values are ignored or produce an empty state, never an error page.

## 4. Robots and canonical rules
1. Temple detail pages use `/temples/[slug]` as the canonical URL.
2. Collection pages link to canonical temple URLs and never duplicate temple pages.
3. `/temples` with any of `q`, `deity`, `state`, `region`, `collection`: `noindex, follow`, canonical to `/temples`.
4. `/temples?page=N`: self-canonical and indexable.
5. Unknown temple slugs: check `SlugRedirect` and 308 to the current slug, otherwise return a real 404 status.
6. Only `PUBLISHED` content appears in the sitemap. Sitemap `lastmod` comes from `updatedAt`.
7. Generate all metadata from the content record.
8. Use breadcrumbs on deeper pages.

## 5. Slug convention (D-009)
Lowercase, URL-safe, stable and unique. Plain name when nationally unique and iconic (`kedarnath`); `name-city` when ambiguous or the site is disputed (`baidyanath-deoghar`). Slugs never change after publication without a `SlugRedirect`. Launch slugs: see `SEED-DATA.md`.

## 6. Reserved future routes
`/stories`, `/stories/[slug]`, `/festivals`, `/festivals/[slug]`, `/states/[state]`, `/regions/[region]`, `/deities/[slug]`, `/yatra`, `/map`. Add them only when the content model and SEO strategy justify them.
