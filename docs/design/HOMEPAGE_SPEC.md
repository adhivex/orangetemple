# Homepage Spec (`/`)

Screenshots: `reference/homepage-desktop.jpg`, `reference/homepage-mobile.jpg`.
Content and data: `code/homepage-content.ts`.

**Priority: mobile → tablet → desktop.** Build each section for phones first.
Breakpoints (Tailwind variants from `code/tokens.css`):

| Layout | Width | Tailwind |
|---|---|---|
| Mobile (priority 1) | ≤ 640px | unprefixed |
| Tablet portrait (priority 2) | 641–980px | `tablet:` |
| Tablet landscape (priority 2) | 981–1199px | `tablet-lg:` |
| Desktop (priority 3) | ≥ 1200px | `desktop:` |

Where this spec describes desktop first and then says "Mobile:", implement the mobile
description as the base styles and the desktop description as the enhancement.

Section order (desktop and mobile are the same order except where noted). A cookie consent
banner overlays the page on first visit; see "Cookie consent" below.

1. Header
2. Hero
3. Stats panel
4. 12 Jyotirlingas rail (`#jyotirlingas`)
5. Char Dham rail (`#char-dham`)
6. Browse: Deity + Region
7. Explore Sacred Bharat (map) (`#explore-bharat`)
8. Desktop: Explore cards (`#stories`) / Mobile: Latest Stories rail
9. Quote band
10–11. Footer (newsletter row, link columns, bottom bar with OrangeKite credit)
12. Mobile only: floating bottom tab bar

## 1. Header

- Fixed, full width, respects `env(safe-area-inset-top)`.
- **Over hero (scrollY ≤ 40):** transparent, white text, logo word "Orange" in #FFB277.
- **Scrolled:** page background (#FBF1E5) at 90% opacity with 14px backdrop blur, ink text, 1px bottom line,
  height 78px → 66px (62px on mobile in both states).
- Logo: temple mark (TempleIcon) + "OrangeTemple" in serif 27px, tagline
  "SACRED BHARAT. ALWAYS WITH YOU." 8.5px uppercase below.
- Desktop nav (≥ 980px): Home, Temples, Jyotirlingas, Char Dham, Explore Bharat, Stories.
  Active item has a 1px underline; hover animates underline from centre.
- Right: search icon button, "Sign In" line button (desktop only).
- < 980px: search + hamburger. Hamburger opens a right-side sheet (shadcn `Sheet`) with the nav
  links in serif 24px and a primary Sign In button.

## 2. Hero

- Height clamp(600px, 90vh, 760px) desktop; auto on mobile with 112px top / 110px bottom padding.
- Background: radial dusk gradient (#c07a55 → #6d4a4a → #2a2026 → #1a1418).
- Image `hero-somnath.jpg` covers the right 68% on desktop, masked to fade in from the left;
  full-bleed on mobile. Use `next/image` with `priority`. Overlay gradients for legibility.
- Content (left aligned): kicker with 42px gold rule, H1, lead, CTA row (primary "Explore
  Temples" → #jyotirlingas, ghost "Begin Your Yatra" → #char-dham), italic quote with a gold left
  rule. Mobile: CTAs stack, min-width 210px.
- Caption bottom-right: pin icon + "Somnath Temple, Gujarat", 12px.

## 3. Stats panel

- White panel overlapping the hero by 62px (46px mobile), radius 18px, `shadow-lift`.
- 4 equal columns with gold gradient hairline dividers.
- Item: 54px icon well (saffron-tint, gold-line border) + serif title + muted subtitle.
  Items 2–4 are links (hover saffron-tint). "1000+" is not a link; its subtitle shows
  "(Coming Soon)" in gold.
- Mobile: still 4 columns inside one panel, stacked icon-over-label, subtitles hidden except
  "Temples (Coming Soon)" under "1000+".

## 4. 12 Jyotirlingas rail

- Section head: emblem (TrishulIcon) + H2 + subtitle + "Explore All Jyotirlingas" link
  (mobile: "View All").
- Horizontal scroll-snap rail of all 12 temples ordered by `jyotirlingaOrder`.
  Desktop: 5 visible, 20px gap. Tablet: 3.2 visible. Mobile: 44% width cards, rail bleeds off
  the right edge.
- Prev/next circular arrow buttons (46px) overlapping the rail edges on desktop; hidden when at
  the start/end. Mobile shows only the next arrow. Scroll step: 2 cards desktop, 1 mobile.
- Temples without an image render the placeholder card.
- Each card links to the temple detail page (`/temples/[slug]`, or the route defined in the
  existing docs).

## 5. Char Dham rail

- Emblem OmIcon, "Explore All Char Dham" / "View All".
- 4 cards, 5:4 images. Desktop: all 4 visible, no arrows. Tablet: 2.3 visible.
  Mobile: 62% width cards with the next arrow.

## 6. Browse: Deity + Region

- Desktop: two columns split by a 1px vertical line, 64px gap. Stack on < 980px.
- **Deity:** 4×2 grid of medallions: Shiva, Vishnu, Devi, Krishna, Rama, Hanuman, Ganesha, All.
  Shiva/Vishnu/Krishna filter to launch temples; unavailable deities show a "coming soon" toast
  (shadcn `Sonner`). "All" opens search.
- **Region:** 3×2 photo grid on desktop (North, South, East, West, Central, Northeast);
  mobile is a horizontal rail of tall tiles (30% width). Clicking a region opens search
  pre-filled with the region name (later: a region listing page).

## 7. Explore Sacred Bharat

- Cream radial background, faint gold temple skyline silhouettes along the bottom (SVG, 10%
  opacity, decorative).
- Desktop grid: text + CTA | map image (max 300px, soft saffron drop shadow) | italic quote with
  gold rule below. Tablet: 2 columns with the quote spanning below.
- Mobile: text 64% wide, map absolutely positioned right below the button, quote right-aligned
  underneath.
- "View Interactive Map" shows a "coming soon" toast in v1. It becomes the Mapbox view later.

## 8a. Explore cards (desktop/tablet only)

- 4 equal-height bordered cards: thumbnail 84×100 radius 10 + serif title + muted line +
  saffron link with arrow. 2 columns on tablet. Hidden on mobile.

## 8b. Latest Stories (mobile only)

- Section head with "See All". Rail of 56%-wide image cards (4:5) showing the story title and a
  "Read More →" line in #FFC08C.

## 9. Quote band

- `band-mountains.jpg`, background position centre 30%, gradient fading to `night` at the
  bottom so it flows into the newsletter.
- Lotus ornament between two 60px gold hairlines, serif italic quote clamp(24px, 3vw, 38px),
  "— ORANGETEMPLE" in 10.5px gold-soft, 5px tracking.

## 10–11. Footer (includes the newsletter)

Screenshots: bottom of `reference/homepage-desktop.jpg` and `reference/homepage-mobile.jpg`.
The whole footer sits on `night`. The quote band above fades into it.

**Row 1: Newsletter.** Two columns on desktop: serif H2 "Join Our Journey" + muted subtitle on
the left; pill form (input + primary Subscribe inside one rounded container, gold border on
focus-within) with the note beneath on the right. Stacks and centres on mobile.
Client-side validation message; success message replaces the note. Wire to a server action
that stores the email (per existing docs). No page reload. 1px gold hairline below the row.

**Row 2: Main grid.** Desktop columns 1.5fr / 1fr / 1fr / 1fr, 48px gap:
- **Brand:** logo (saffron "Orange"), one-line description
  ("A mobile-first guide to the sacred temples of Bharat: their stories, traditions and the
  yatras that lead to them."), 5 circular social buttons (38px, gold hairline, fill saffron on
  hover).
- **Explore:** 12 Jyotirlingas, Char Dham, Temples by Deity, Temples by Region, Interactive Map.
- **Discover:** Temple Stories, Festivals, Plan Your Yatra, Knowledge.
- **OrangeTemple:** About, Contact, Privacy Policy, Terms of Use, Disclaimer, Cookie Settings
  (a button that reopens the cookie preferences dialog).
- Column headings: 11px uppercase, 2.6px tracking, gold-soft. Links 14.5px at 72% opacity,
  white on hover.
- Tablet: brand spans full width, three link columns below. Mobile: brand full width, Explore
  and Discover side by side, the OrangeTemple column full width with its links in two columns.

**Row 3: Bottom bar** (1px hairline above):
- Left: "© 2026 OrangeTemple.in | A tribute to Sanatan Dharma" (stacked on mobile, no pipe).
- Right: "Designed & Developed by **OrangeKite**", where "OrangeKite" links to
  `https://orangekite.in/` (`target="_blank" rel="noopener"`), white text with a gold underline
  that turns saffron on hover. Then a circular back-to-top button.
- Mobile adds bottom padding for the tab bar.

## Cookie consent

Screenshots: `reference/cookie-banner-desktop.jpg`, `cookie-banner-mobile.jpg`,
`cookie-preferences-desktop.jpg`, `cookie-preferences-mobile.jpg`.

**Banner** (shown 1.2s after first load when no choice is stored):
- Floating card bottom-left on desktop (420px wide, 24px from the edges); on mobile it spans the
  width with 12px side margins and sits above the tab bar.
- Lotus icon well + serif title "We value your privacy", short text with a Privacy Policy link.
- Two equal-weight buttons side by side: "Reject optional" (outline) and "Accept all"
  (primary). Rejecting must be as easy as accepting. Below them, a text link
  "Customise preferences". No close (X) button; the visitor must choose.
- Slides up and fades in; it's a non-blocking region, so the page stays usable.

**Preferences dialog** (from the banner link or footer "Cookie Settings"):
- Modal dialog (shadcn `Dialog`), serif title "Cookie preferences", intro line.
- Categories: **Essential** (always on, no toggle, "ALWAYS ON" label in gold),
  **Analytics** (toggle, off by default), **Marketing** (toggle, off by default).
  Toggles are saffron when on (shadcn `Switch`).
- Footer buttons: Reject optional, Save choices, Accept all. On mobile, the first two share a
  row and Accept all is full width.
- Opening it pre-fills the toggles from the stored choice. Esc / scrim click closes it without
  saving.

**Behaviour:**
- Store the choice in a first-party cookie `ot_consent` (365 days, `SameSite=Lax`, `Secure`) so
  the server can read it, as JSON: `{ v: 1, essential: true, analytics, marketing, ts }`.
  If the policy version changes, show the banner again.
- Confirm with a toast: "Preferences saved. Thank you." or "Only essential cookies will be
  used."
- **No optional script may load before consent.** Analytics/marketing scripts (for example
  GA4 or Vercel Analytics, whichever the docs specify) load only when their category is
  allowed, and are removed on the next page load if consent is withdrawn. Expose a
  `useConsent()` hook and a `<ConsentGate category="analytics">` wrapper for this.
- Legal pages (Privacy Policy, Cookie Policy text) are content work for later; link to their
  routes now.

## 12. Mobile tab bar (< 640px)

- Floating frosted panel: 10px from the sides, 8px above the safe-area inset, radius 20px,
  blur 16px, `line` border. Items: Home, Temples, Yatra, Stories, More (More opens the menu
  sheet). Active item saffron. Body gets bottom padding so content is never hidden.

## Search overlay

- Opened by the header search button, the "All" deity tile, and region tiles.
- shadcn `CommandDialog` (or `Dialog` + list) with a large serif input, results showing
  "Name" and "State · Group". Searches name, state, region and group across launch temples.
- Empty state: "No temples match that yet. Try a state like "Gujarat" or a region like "South"."
- Esc and scrim click close it.

## SEO

- `<title>`: "OrangeTemple — Discover the Sacred Temples of Bharat".
- Meta description from the hero lead.
- Headings: single H1 in the hero; each section uses H2; cards use H3.
