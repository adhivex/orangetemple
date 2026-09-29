# Component Inventory

Suggested paths follow a `src/` Next.js App Router layout. Adapt to the structure already
defined in the project docs if it differs. Server components by default; mark only the
interactive pieces `"use client"`.

| Component | Path | Client? | Props / notes |
|---|---|---|---|
| `SiteHeader` | `components/layout/site-header.tsx` | yes | Transparent-over-hero → solid on scroll. `variant?: "overlay" \| "solid"` (inner pages start solid). |
| `MobileNavSheet` | `components/layout/mobile-nav-sheet.tsx` | yes | shadcn `Sheet`. Opened by hamburger and tab bar "More". |
| `MobileTabBar` | `components/layout/mobile-tab-bar.tsx` | yes | Uses `usePathname` for the active tab. |
| `SiteFooter` | `components/layout/site-footer.tsx` | no | Newsletter row + 4-column grid + bottom bar with OrangeKite credit link. Link data from `homeCopy.footer`. |
| `CookieConsentProvider` | `components/consent/cookie-consent-provider.tsx` | yes | Reads/writes the `ot_consent` cookie, exposes `useConsent()` and `openPreferences()`. Wrap the app in `layout.tsx`. |
| `CookieBanner` | `components/consent/cookie-banner.tsx` | yes | First-visit banner. |
| `CookiePreferencesDialog` | `components/consent/cookie-preferences-dialog.tsx` | yes | shadcn `Dialog` + `Switch`. Opened from the banner and the footer "Cookie Settings" button. |
| `ConsentGate` | `components/consent/consent-gate.tsx` | yes | `category: "analytics" \| "marketing"`; renders children (e.g. analytics `<Script>`) only when allowed. |
| `Logo` | `components/brand/logo.tsx` | no | `tone?: "onPhoto" \| "onCream" \| "onDark"`, `showTagline?: boolean`. |
| `Hero` | `components/home/hero.tsx` | no | Content from `homeCopy.hero`. `next/image priority`. |
| `StatsPanel` | `components/home/stats-panel.tsx` | no | |
| `SectionHeader` | `components/ui/section-header.tsx` | no | `icon?`, `title`, `subtitle`, `moreHref?`, `moreLabel?`, `moreLabelMobile?`, `id?`. |
| `Rail` | `components/ui/rail.tsx` | yes | Scroll-snap track + arrows. `itemClassName` controls visible count per breakpoint. `showPrevOnMobile=false`. |
| `TempleCard` | `components/temple/temple-card.tsx` | no | `temple`, `aspect: "portrait" \| "landscape"`, `chipLabel?`. Renders `TemplePlaceholder` when no image. |
| `TemplePlaceholder` | `components/temple/temple-placeholder.tsx` | no | |
| `DeityGrid` | `components/home/deity-grid.tsx` | yes | Toast for unavailable deities, opens search for "All". |
| `RegionGrid` | `components/home/region-grid.tsx` | yes | Grid desktop, rail mobile; opens search with region query. |
| `ExploreMap` | `components/home/explore-map.tsx` | yes (button only) | |
| `ExploreCards` | `components/home/explore-cards.tsx` | no | `hidden sm:block`. |
| `LatestStories` | `components/home/latest-stories.tsx` | no | `sm:hidden`, uses `Rail`. |
| `QuoteBand` | `components/home/quote-band.tsx` | no | |
| `NewsletterForm` | `components/forms/newsletter-form.tsx` | yes | `useActionState` + server action; zod email validation. |
| `TempleSearch` | `components/search/temple-search.tsx` | yes | shadcn `CommandDialog`; global open state via small context/zustand or URL param. |
| Icons | `components/icons/index.tsx` | no | Copy `docs/design/code/icons.tsx`. |

shadcn/ui pieces to add: `button`, `sheet`, `dialog`, `command`, `input`, `switch`, `sonner`.
Restyle `button` variants to match: `default` (saffron gradient pill), `ghost-light`
(on photos), `line`, `link`.
