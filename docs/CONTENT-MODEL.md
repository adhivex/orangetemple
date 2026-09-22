# OrangeTemple — Content Model

## 1. Principles
- Be factual, respectful and clear.
- **Documented information and traditional belief are separate.** `history` holds documented history; `legend` holds traditional narratives. The UI labels legends as traditional belief. Never present a legend as verified fact.
- Avoid stating disputed claims as established fact. Where a site is disputed, say so in `locationNote`.
- Every non-trivial historical claim should be backed by a `TempleReference`.
- Do not fabricate temple information, timings, coordinates, URLs, references, statistics or credits.
- Use original or properly licensed imagery only, with credit. No AI-generated imagery of temples or deities.
- Depict deities and sacred places with respect. Use standard, commonly used transliterations.

## 2. Requirements to publish a temple
Required: `name`, `slug`, `shortDescription`, `overview`, `significance`, `deity`, `state`, `city`, one licensed HERO image with alt text, at least one reference, and `status = PUBLISHED`.

Recommended: history, legend, architecture, rituals, festivals, visit information, nearby places, gallery, official website, native name, alternate names.

## 3. Empty-field behaviour
- A section with no content is **hidden**. Never render "coming soon" or filler text in a temple page section.
- Exception, visit information: if timings and other visit details are missing, or `lastVerifiedAt` is empty or older than 12 months, show a notice: "Timings and access rules change. Please confirm with the official source before you travel." with the official link when one is verified.
- When visit information exists, show "Last verified {month year}" and its source.
- If coordinates are missing, hide the map and Directions button and show the address only.

## 4. Temple page: section to field mapping
| Section | Source |
|---|---|
| Hero | HERO image, `name`, `city`, State, Deity |
| Quick facts | Deity, State/city, collections, `estimatedPeriod`, `architectureStyle`, `bestTimeToVisit`, `seasonalAccess`, `nearestAirport`, `nearestRailway` |
| About | `overview` (and `locationNote` where present) |
| Spiritual significance | `significance` |
| History | `history` |
| Traditional legends | `legend` (labelled as traditional belief) |
| Architecture | `architecture` |
| Rituals | `Ritual` records |
| Festivals | `TempleFestival` with `Festival.recurrenceNote` |
| Plan your visit | `TempleVisitInfo` (timings, entry rules, dress code, photography, best time, seasonal access, how to reach) |
| Gallery | `TempleImage` (GALLERY) |
| Nearby sacred places | `NearbyPlace` (link internally when `relatedTempleId` is set) |
| Related temples | Derived (see `DATABASE-SCHEMA.md`) |
| References | `TempleReference` |

## 5. Collection content
Each collection has a name, subtitle, short description, introduction, cover image, ordered temples and related collections.

- **12 Jyotirlingas**: introduction explains the tradition briefly and, where sites are traditionally disputed, notes it respectfully.
- **Char Dham**: introduction states that this collection is the four dhams of Badrinath, Dwarka, Puri and Rameshwaram, and distinguishes it from the Uttarakhand Chota Char Dham (D-018).

## 6. Sourcing and review
1. Drafts may be written by Claude in original wording from well-established knowledge, but all such content starts unreviewed.
2. Each temple must be reviewed by a human against reliable sources before it is marked `reviewed: true` in its seed record (see `SEED-DATA.md`).
3. Reliable sources include the temple or trust's official channels, government tourism and heritage bodies, archaeological and academic publications, and recognised traditional texts.
4. Time-sensitive details (timings, entry rules, registration, road and seasonal access) need a source and a verification date, or they are left out.

## 7. Media
- Roles: HERO, GALLERY, THUMBNAIL, OG.
- Every image needs meaningful alt text, credit, licence type and source.
- Store images in Cloudinary, not in the repository.
- Consistent aspect ratios (see `DESIGN-SYSTEM.md`).
- Publish a `/credits` page listing image and source attributions.

## 8. Language
V1 UI is English. Temple names may include a Devanagari native name (`nameNative`) and searchable `alternateNames` (for example Rameshwaram / Rameswaram, Kashi / Varanasi / Benares).

## 9. Future collections
Chota Char Dham (Uttarakhand), Panch Kedar, Shakti Peethas, Divya Desams, Ashtavinayak, Pancha Bhoota Stalas, major Shiva, Vishnu and Devi temples.
