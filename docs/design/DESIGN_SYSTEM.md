# OrangeTemple Design System (v1, "Premium Saffron")

Approved design for the first live version of orangetemple.in. The reference build is
`docs/design/reference/orangetemple-home.html`. Open it in a browser and resize between
desktop and phone widths. When this document and the reference disagree, the reference wins
on visual detail and this document wins on structure and behaviour.

## Platform priority (applies to every decision)

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

## Direction

Premium, minimal, spiritual. Warm ivory surfaces, deep saffron as the only loud colour,
temple gold used sparingly as hairlines, rings and small uppercase labels. Large classical
serif headings; quiet sans-serif body. Photography carries the emotion; UI chrome stays out
of the way. The phone layout is its own design, not a shrunken desktop.

## Colour

Approved brand palette (six core colours):

| Role | Hex |
|---|---|
| Page background (all content sections) | #FBF1E5 |
| Section background | #FAF7F0 |
| Card background | #EDE2CF |
| Primary text | #2B2118 |
| Accent / buttons | #D96B22 |
| Secondary text | #8B5E3C |

Full token set (derived from the palette):

| Token | Value | Use |
|---|---|---|
| `surface` | #FBF1E5 | Page background for every content section, medallion fill |
| `surface-alt` | #FAF7F0 | Icon wells, hover backgrounds |
| `card-surface` | #EDE2CF | Stats panel, explore cards, cookie banner |
| `cream` | #EDE2CF | Map section |
| `ink` | #2B2118 | Headings, primary text |
| `ink-2` | #5A4332 | Body copy on light surfaces |
| `muted-ink` | #8B5E3C | Secondary text: subtitles, captions, state labels |
| `saffron` | #D96B22 | Buttons, links, active states, icons |
| `saffron-bright` | #E37B33 | Top stop of the primary-button gradient |
| `saffron-deep` | #B5561A | Button hover/pressed |
| `saffron-soft` | #F6DFC9 | Chip/badge backgrounds |
| `saffron-tint` | #FAF7F0 | Icon wells, hover backgrounds |
| `gold` | #8B5E3C | Hairlines, quote dividers, "Coming Soon" text |
| `gold-soft` | #EDE2CF | Kicker and labels on dark/photo backgrounds |
| `gold-line` | #8B5E3C @ 28% | 1px borders on emblems, medallions, dividers |
| `line` | #E2D4BD | Card borders, separators |
| `night` / `night-2` | #2B2118 / #231A12 | Footer, quote band fade, image-card base |

Section rhythm: every content section (Jyotirlingas, Char Dham, Deity/Region, Explore/Stories)
sits on one continuous `surface` (#FBF1E5). Only the map section (`cream`), the quote band and
the footer (`night`) change the background. Deity medallions are filled with `surface` and
outlined with `gold-line`.

Rules: the accent is for action and emphasis, never for large backgrounds. Secondary text
(#8B5E3C) is only for supporting text at 12px+ (contrast ≈ 5:1 on #FBF1E5). No pure black or
pure white text on light surfaces; white text on photos always sits on the dark gradient.

## Typography

- **Display/headings:** Cormorant Garamond 500/600 (italic 400/500 for quotes).
- **Body/UI:** DM Sans 300/400/500/600.
- Load both with `next/font/google` (see `code/fonts.ts`).

| Role | Desktop | Mobile | Notes |
|---|---|---|
| Hero H1 | clamp(48px, 6.4vw, 84px) / 0.98, -0.8px | 47px | weight 500 |
| Section H2 | clamp(32px, 3.6vw, 46px) / 1.02 | 31px | weight 500 |
| Card title (on image) | 25px / 1.05 | 21px | serif 600, white |
| Stat title | 21px serif 600 | 12.5px sans 500 | "1000+" stays serif 19px on mobile |
| Kicker | 11.5px, letter-spacing 5px, uppercase | 9.5px, 2.6px, nowrap | gold-soft, leading 42px rule |
| State label | 11px, 2px tracking, uppercase | 10px | gold-soft |
| Body | 16px / 1.6 | 15–15.5px | hero lead is weight 300 |
| Quotes | serif italic 21–38px | 18–25px | |

## Spacing, radius, elevation

- Container: max 1200px, side padding 32px desktop / 20px mobile.
- Section rhythm: 96px top on desktop (72px between consecutive rail sections), 56px mobile.
- Radii: image cards 16px (14px mobile), stats panel 18px, region tiles 14px, buttons and
  inputs fully rounded (pill).
- Shadows: `shadow-soft` for cards, `shadow-lift` for the stats panel only, `shadow-cta` on
  primary buttons.

## Components (visual rules)

- **Primary button:** pill, vertical gradient saffron-bright → saffron, white text, inner top
  highlight, `shadow-cta`. Trailing arrow nudges 3px right on hover.
- **Ghost button (on photos):** pill, 1px white/55% border, light blur; hover fills white with
  night text.
- **Line button (header Sign In):** transparent, 1px currentColor border; hover fills saffron.
- **Section emblem:** 64px circle (48px mobile), 1px gold-line border, faint saffron radial fill,
  36px saffron icon.
- **"More" link:** ink text with 1px gold-line underline and saffron arrow; hover turns saffron.
  Desktop label e.g. "Explore All Jyotirlingas"; mobile label "View All".
- **Image card:** photo fills card (4:5 for Jyotirlingas, 5:4 for Char Dham), dark bottom
  gradient, serif name + uppercase gold state label bottom-left. Hover: image scales to 1.06
  over 1.1s. Glass chip ("Jyotirlinga"/"Char Dham") top-left **on mobile only**.
- **Placeholder card:** same frame, deep saffron-to-brown radial background, faint temple icon,
  "PHOTO COMING SOON" label. Never reuse another temple's photo.
- **Deity medallion:** 74px circle (66px mobile), card background, 1px gold-line border plus an
  inner double ring; hover lifts 4px with saffron glow.
- **Region tile:** photo tile, 1.35 aspect desktop / 0.7 mobile, serif label on dark gradient.
  Northeast uses a deep green gradient with a leaf icon until a photo exists.

## Motion

Easing `cubic-bezier(.2,.7,.2,1)`. Only one orchestrated moment: the hero image settles in
(scale 1.08 → 1, fade) over 2.6s on load. Everything else is hover feedback (0.2–0.4s) and the
slow 1.1s image zoom. Respect `prefers-reduced-motion` by disabling all of it.

## Theme: cream only (no dark mode)

The site always renders in the cream theme (#FBF1E5 background), even when the visitor's
phone, tablet or computer is set to dark mode. Do not add dark-mode styles, `dark:` classes,
`prefers-color-scheme: dark` queries or a theme switcher, and do not install next-themes.
Set `color-scheme: light` on `:root` and `colorScheme: "only light"` in the viewport metadata
so browsers don't auto-darken the page or form controls. The dark areas that are part of the
design (footer, quote band, photo gradients) stay exactly as specified.

## Accessibility baseline

- All interactive elements keyboard reachable, visible saffron focus ring.
- Carousels: native horizontal scroll with scroll-snap; arrow buttons have `aria-label`s and
  hide (not just disable) at the ends.
- Decorative images `alt=""`; temple photos `alt="{Name} temple, {State}"`.
- Body text contrast ≥ 4.5:1; white text on photos always sits on the dark gradient.
- Tap targets ≥ 44px on mobile.
