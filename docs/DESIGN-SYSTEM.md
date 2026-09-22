# OrangeTemple — Design System

## 1. Direction
Premium, minimal, spiritual, modern, warm, cinematic, editorial, rooted in Indian heritage. The experience is driven by **high-quality photography, typography, whitespace and subtle motion**.

Avoid: generic SaaS or dashboard styling, excessive gradients, 3D effects, excessive animation, clutter, cheap religious graphics, over-decorative UI.

## 2. Colour tokens (light theme only in V1)
Use CSS variables or Tailwind theme tokens. Never hardcode hex values in components. Values below meet WCAG AA for their stated use; re-check with a contrast tool if you change any value.

| Token | Value | Use |
|---|---|---|
| `--ivory-50` | `#FBF6EC` | Page background |
| `--sand-100` | `#EFE6D6` | Sections, cards, dividers |
| `--charcoal-900` | `#1F1B16` | Primary text; text on saffron fills |
| `--charcoal-700` | `#3A342D` | Secondary text |
| `--stone-600` | `#6B6257` | Meta text on ivory (AA) |
| `--saffron-500` | `#F28C28` | Brand fill, highlights. **Use charcoal text on it, never white.** |
| `--saffron-700` | `#BF510C` | Primary button background with white text |
| `--saffron-800` | `#A63F08` | Links and small text on ivory |
| `--gold-500` | `#B08D3C` | Decorative accents and borders only. Never for text. |

Bright saffron (#FF9933) with white text is only about 2:1 and fails AA. Do not use it that way.

## 3. Typography (D-016)
- Display and headings: **Fraunces**
- Body and UI: **Inter**
- Native script: **Noto Serif Devanagari** (headings) and **Noto Sans Devanagari** (body), loaded only on pages that show native-script text; mark such text with `lang="hi"`.
- Load with `next/font`, `display: swap`.

| Style | Mobile | Desktop |
|---|---|---|
| Display | 40 / 44 | 72 / 76 |
| H1 | 32 / 38 | 52 / 58 |
| H2 | 26 / 32 | 38 / 44 |
| H3 | 20 / 28 | 26 / 34 |
| Body | 17 / 27 | 18 / 29 |
| Small / meta | 14 / 20 | 14 / 20 |
| Label | 12–13, uppercase, tracked | same |

Body text never below 16 px. Reading measure about 60–70 characters for long text. Do not overuse decorative typography.

## 3a. Layout and tokens
- Base design width 360 px. Test at 360, 390, 430, 768, 1024, 1440.
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536).
- Spacing on a 4 px base. Section spacing about 64 px mobile, 96 px desktop.
- Containers: narrow (reading), standard (most pages), wide (galleries, maps).
- Radius: cards 12 px, buttons 10 px, chips full.
- Aspect ratios: cards 4:5 (mobile carousel) and 3:2 (desktop grid); temple hero 4:5 mobile and 16:9 desktop; gallery 3:2; Open Graph 1200×630.

## 4. Navigation (D-010)
**Mobile (below `md`):**
- Top bar: logo and search icon.
- **Bottom tab bar:** Home, Temples, Explore, Search. Minimum 56 px tall plus `env(safe-area-inset-bottom)`.
- A menu sheet holds collections, About, Credits, Contact and Privacy.
- On temple pages the bottom bar is replaced by an **action bar**: Directions (opens the maps app using coordinates) and Share (Web Share API, with copy-link fallback).

**Desktop (`md` and up):** header with logo, Temples, Jyotirlingas, Char Dham, Explore Bharat, Search. No Stories in V1.

## 5. Mobile patterns
- Filters open in a **bottom sheet**; on `lg` they become an inline bar or side panel.
- Collections and home sections use **horizontal swipe carousels** with scroll-snap on mobile and grids on desktop. Do not shrink the desktop layout.
- Gallery is swipeable, with a lightbox that supports keyboard, focus trapping and reduced motion.
- All touch targets at least 44×44 px.
- Prefer thumb-zone placement for primary actions.

## 6. Hero
Temple pages use immersive photography with a text scrim (dark gradient from the bottom) so overlay text stays at least 4.5:1 over the brightest part of the image. The homepage hero communicates sacred discovery and a single strong CTA.

## 7. Cards
Editorial, not SaaS-style. Image, temple name, location, collection or deity label, short supporting text, and a clear interaction affordance (the whole card is one link).

## 8. Buttons
- Primary: `--saffron-700` background, white text.
- Alternative fill: `--saffron-500` background, `--charcoal-900` text.
- Secondary: neutral outline.
- Visible focus ring on every interactive element, touch-friendly size.

## 9. Imagery
Original or licensed photography only, with credit. Authentic locations, respectful depiction of deities, cinematic but natural compositions, consistent aspect ratios. No AI-generated images of temples or deities.

## 10. Motion
Framer Motion used sparingly: hero reveal, section entrance, card interaction, gallery transitions, mobile navigation. Durations 200–400 ms. Use `LazyMotion`. Respect `prefers-reduced-motion`: disable or simplify all non-essential motion.

## 11. State design
Provide visually consistent, on-brand states for: loading (skeletons matching final layout), empty search results (with suggestions and a reset action), missing images (neutral fallback), invalid temple slug (404 with links back), database error (friendly error page with retry), and hidden empty sections.

## 12. Accessibility
Semantic HTML, keyboard navigation, visible focus states, meaningful alt text, AA contrast, reduced-motion support, accessible names on icon buttons, correct heading order, and `lang` attributes on native-script text. Verified with axe in automated tests and a manual keyboard pass.

## 13. PWA visuals
Provide a 192 px and 512 px icon, a maskable icon, and an apple-touch icon. `theme-color` is `--saffron-700`; `background_color` is `--ivory-50`.
