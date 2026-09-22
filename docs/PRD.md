# OrangeTemple — Product Requirements Document

## 1. Product
OrangeTemple.in

## 2. Vision
A digital gateway to the sacred temples and spiritual heritage of Bharat. It helps visitors discover temples, understand their significance, explore their stories, and eventually plan pilgrimages. The experience is designed mobile-first, so it feels like a native app in the browser rather than a shrunken desktop site.

## 3. V1 launch objective
Launch a polished, mobile-first experience covering:
- **15 unique temples**: the 12 Jyotirlingas and the 4 Char Dham (Rameshwaram is in both)
- Temple discovery, search and filtering
- Temple detail pages with high-quality imagery
- Essential, sourced visit information
- SEO-ready content architecture
- An installable PWA shell (manifest and icons)

The 15 temples are the beginning, not the final scope. The architecture must scale to hundreds or thousands.

## 4. Audiences
- Pilgrims planning temple visits, often on mobile and on slow or unreliable networks
- People discovering Indian temple heritage
- Families and travellers researching sacred destinations
- Readers looking for temple history, legends, rituals and festivals

## 5. Homepage requirements
1. Premium hero section with a primary call to action
2. Short introduction to OrangeTemple
3. 12 Jyotirlingas section
4. Char Dham section
5. Explore by deity (only deities with at least one published temple; hidden if fewer than 3)
6. Explore by region (same rule)
7. Sacred Bharat entry point linking to `/explore-bharat`
8. Footer with useful navigation, credits, contact and privacy links

Stories are **not** part of V1 (D-005).

## 6. Temple directory (`/temples`)
- Search (names, native names, alternate names, city, state)
- Filters: deity, state, region, collection
- Responsive card grid; filters open in a bottom sheet on mobile
- Server-side pagination with real links (24 per page)
- Empty, loading and error states

## 7. Temple detail page (`/temples/[slug]`)
Sections, in order, each hidden when it has no content: hero, quick facts, about, spiritual significance, history, traditional legends, architecture, rituals, festivals, plan your visit (including how to reach), gallery, nearby sacred places, related temples, references. Field mapping is in `CONTENT-MODEL.md`.

Mobile: sticky action bar with **Directions** and **Share**.

## 8. Collections
- `/jyotirlingas` and `/char-dham`, both rendered by one shared template
- Each has an introduction, ordered temple cards, and links to canonical temple URLs
- Rameshwaram is a single temple record that belongs to both collections

## 9. Explore Bharat (`/explore-bharat`)
State-by-region browse page. Each state links to the filtered directory. The interactive map is future scope.

## 10. Non-goals for V1
- User accounts, saved or visited temples
- Stories, festival calendar, yatra planner
- Interactive map, offline mode, Hindi UI
- Booking, payments, donations
- Social or community features, AI assistant
- Microservices or extra infrastructure

## 11. Success and launch criteria
- All 15 temples have reviewed content and licensed hero images; no placeholder images in production
- Visit information is either sourced with a last-verified date or hidden
- Disputed sites carry a location note; legends are labelled as traditional
- Lighthouse mobile (production build, throttled): Performance 90+, Accessibility 95+, SEO 100 on `/` and a temple page
- Core Web Vitals targets in `ARCHITECTURE.md` met
- Usable at 360 px width with no horizontal scrolling
- Sitemap, robots, canonical URLs and structured data validated
- Adding a temple needs only seed data and images, not code changes
