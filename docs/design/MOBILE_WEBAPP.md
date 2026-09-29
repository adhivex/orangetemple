# Mobile & Tablet Web App Requirements

Priority order: **mobile web first, tablet web second, desktop web third.**
OrangeTemple is used mostly on phones, often on patchy connections at pilgrimage sites. It must
feel like an installed app: fast, thumb-friendly, installable to the home screen, and graceful
offline. Reference: `reference/orangetemple-home.html` (open on a phone or in device mode) and
`reference/mobile-app-interactions.jpg`.

## 1. Installable (PWA)

- `src/app/manifest.ts` from `code/manifest.ts`. Icons are in `public/icons/` (192, 512,
  maskable 512, apple-touch 180, favicon 32, SVG).
- Viewport + Apple web-app metadata from `code/viewport-metadata.ts`. Never disable pinch-zoom.
- **Install card** inside the "More" bottom sheet:
  - Android/Chrome: capture `beforeinstallprompt`, show the card, call `prompt()` on tap, hide
    after `appinstalled`.
  - iOS Safari: show the card; tapping Install reveals the tip "Tap Share, then Add to Home
    Screen."
  - Hidden when `display-mode: standalone`. Never show an unprompted install popup over content;
    the cookie banner is the only first-visit overlay.
- **Standalone mode:** status bar is `black-translucent`, so the header already pads by
  `env(safe-area-inset-top)`. Test the installed app on iPhone and Android.

## 2. Offline and performance

- Service worker with **Serwist** (`@serwist/next`), registered only in production:
  - Precache the app shell and an `/offline` page (serif title "You're offline", short text,
    "Try again" button, same header/footer).
  - Runtime caching: pages network-first (3s timeout, then cache, then `/offline`); images and
    fonts cache-first with expiry (60 days, max 200 entries); never cache POST, auth, or
    `/api/*` responses.
  - Show a toast "Back online" / "You're offline, showing saved pages" on connectivity change.
- Performance budget on a mid-range Android over 4G: LCP < 2.5s, INP < 200ms, CLS < 0.1, JS for
  the homepage < 170 KB gzipped.
  - Hero image `priority` + `fetchPriority="high"`; everything else lazy.
  - Explicit `sizes` on every `next/image`; AVIF/WebP via Next image optimisation.
  - Fonts via `next/font` (self-hosted, `display: swap`).
  - Client components only where interaction needs them (see COMPONENTS.md).

## 3. Touch and ergonomics

- Minimum tap target 44×44px on mobile: icon buttons, rail arrows, social and back-to-top
  buttons, "View All" links (padded), footer links (10px vertical padding each), cookie
  buttons (≥ 46px tall), tab bar items (≥ 56px tall).
- Primary navigation lives in the bottom tab bar (thumb zone). Actions that matter are never only
  in the top corners.
- Inputs use `font-size: 16px` or larger so iOS doesn't zoom on focus. Use correct
  `type`/`inputMode`/`autoComplete`/`enterKeyHint` (email: `type="email"
  autoComplete="email"`; search: `type="search" enterKeyHint="search"`).
- Remove the grey tap highlight (`-webkit-tap-highlight-color: transparent`) and give every
  tappable element a pressed state instead: cards and region tiles scale to 0.975, buttons 0.97,
  medallions 0.94.
- Hover effects (image zoom, lift, arrow nudge) apply only under `@media (hover: hover)`, so
  taps don't leave elements stuck in a hover state.
- `touch-action: manipulation` on interactive elements (no double-tap delay).
- `-webkit-touch-callout: none` and `user-select: none` on cards, tiles, tab bar and buttons (not
  on text content).
- Horizontal rails: native scroll with `scroll-snap`, `overscroll-behavior-x: contain` so a
  sideways swipe doesn't trigger browser back navigation.

## 4. App-like navigation behaviour (phones, < 640px)

- **Header hides on scroll down** (after 260px) and reappears on any scroll up or near the top.
  It never hides while an overlay is open.
- **Bottom tab bar** stays visible. The active tab follows the section in view (scroll-spy with
  IntersectionObserver, root margin -45% / -50%): Home → hero, Temples → Jyotirlingas,
  Yatra → Char Dham, Stories → stories. On real routes later, use `usePathname`.
- **"More" and hamburger open a bottom sheet** (not a side drawer): 22px top radius, grab
  handle, close button, serif nav links, Sign In, install card. Max height 88dvh, scrolls
  internally with `overscroll-behavior: contain`. Slides up over 0.38s. Use shadcn `Sheet` with
  `side="bottom"` on mobile and `side="right"` from 640px up.
- **Search is full screen** on mobile: search icon + large input + "Cancel" text button in a
  top row that respects the safe area; results are full-width rows ≥ 52px tall with dividers.
  Desktop keeps the centred dialog.
- Opening any overlay locks body scroll; closing restores it. Esc and Android back gesture close
  the top overlay (push a history state when opening, `popstate` closes it).

## 5. Safe areas and viewport units

- `viewport-fit=cover` + `env(safe-area-inset-*)` on: header top, tab bar bottom, bottom sheet
  bottom, full-screen search top/bottom, cookie banner bottom, and left/right container padding
  in landscape (`max(20px, env(safe-area-inset-left))`).
- Use `svh`/`dvh` instead of `vh` for full-height things (hero uses `90svh`, overlays `100dvh`)
  so mobile browser toolbars don't cause jumps.
- `overflow-x: hidden` on body is a safety net only; nothing may actually overflow at 320px width.

## 6. Tablet (641px – 1199px)

Screenshots: `reference/homepage-tablet-portrait-768.jpg`,
`reference/homepage-tablet-landscape-1024.jpg`, `reference/tablet-menu-768.jpg`.
Tablets are touch devices with room to spare: keep the desktop structure, but size and space
it for fingers.

**Breakpoints** (`tablet:` / `tablet-lg:` variants). Tablet portrait 641–980px (iPad mini/Air/Pro portrait, Android tablets);
tablet landscape 981–1199px (iPad landscape at 1024/1180). Desktop starts at 1200px.

**Navigation**
- Portrait (≤ 980px): header with logo, search and menu button (no inline nav, no bottom tab
  bar). Menu opens as a right-side sheet, 380px wide, serif links at 26px, Sign In and the
  install card.
- Landscape (981–1199px): full inline nav, compacted (20px gaps, 13.5px text, never wraps),
  search and Sign In on the right. Nothing in the header may wrap to two lines.

**Layout**
- Container side padding 32px (respecting safe-area insets).
- Stats panel sits inside the page gutters (never edge to edge) and stacks each item as icon
  over title over subtitle, centred, in 4 columns.
- Rails bleed off the right edge so the next card peeks, signalling that it scrolls:
  Jyotirlingas 3.3 cards visible in portrait, 4.3 in landscape; Char Dham 2.4 in portrait,
  4 in landscape. Card titles scale with `clamp(20px, 2.3vw, 24px)` and never truncate.
- Hero: 72svh tall in portrait (560–720px), image covers 78% of the width.
- Deity medallions: all 8 in one row in portrait. Regions: 3×2 photo grid.
- Deity and Region stack vertically in portrait; side by side in landscape.
- Explore cards: 2×2 grid. Latest Stories rail is phone-only.
- Footer portrait: brand row with description on the left and social buttons on the right,
  then three link columns.
- Cookie banner: 400px card, bottom-left.

**Touch (any coarse pointer, including tablets)**
- Use `@media (pointer: coarse)` rather than width alone: icon buttons 46px, rail arrows 48px,
  social and back-to-top 44px, footer links padded to ≥ 36px rows with 44px effective targets,
  inputs at 16px, cookie buttons ≥ 46px tall.
- Hover-only effects stay behind `@media (hover: hover)`, so iPads with a trackpad get hover
  and touch-only tablets don't.
- Support both orientations; nothing should jump or overflow on rotate.

## 7. Orientation and sizes to test

- Phones: 320×568, 360×800, 390×844, 430×932, plus landscape phones (hero compacts when height
  ≤ 520px).
- Tablets: 744×1133 (iPad mini), 768×1024, 820×1180 (iPad Air), 800×1280 (Android), and the
  same in landscape: 1024×768, 1180×820, 1280×800.
- Test on real devices: iPhone and iPad Safari, Android phone and tablet Chrome, Samsung
  Internet, and the installed PWA on each.

## 8. Acceptance checklist

- [ ] Lighthouse (mobile): Performance, Accessibility, Best Practices, SEO ≥ 90 each.
- [ ] Installable in Chrome (manifest + service worker valid) and via Add to Home Screen on iOS.
- [ ] Offline: reload with network off shows cached pages or the offline page, never the
      browser's error page.
- [ ] No horizontal page scroll at 320px; no tap target under 44px.
- [ ] No iOS zoom on focusing any input.
- [ ] Header hide/show, scroll-spy, bottom sheet and full-screen search behave as described.
- [ ] Cookie banner, tab bar and install card never overlap each other's buttons.
- [ ] Tablet portrait and landscape: header never wraps, rails peek, card titles never
      truncate, stats panel stays inside the gutters, rotating causes no overflow.
