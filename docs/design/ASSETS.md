# Image Assets (interim, v1)

All images in `public/images/` were cut from the approved design mockups. They are low
resolution and exist only so v1 can go live. Replace them with
high-quality photos (via Cloudinary) after launch; no layout changes should be needed.

| File | Used for |
|---|---|
| `home/hero-somnath.jpg` | Hero image |
| `home/band-mountains.jpg` | Quote band background |
| `home/map-india.png` | Map section (transparent PNG with pins) |
| `temples/somnath.jpg` … `temples/rameshwaram.jpg` (10 files) | Temple cards |
| `regions/north.jpg`, `south.jpg`, `east.jpg`, `west.jpg`, `central.jpg` | Region tiles |
| `stories/temple-stories.jpg`, `festivals.jpg`, `plan-your-yatra.jpg`, `knowledge.jpg` | Desktop explore cards |
| `stories/story-kedarnath.jpg`, `story-mahashivratri.jpg` | Mobile latest stories |

**No photo yet:** Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Grishneshwar, and the
Northeast region. These use the designed placeholder. Do not substitute another temple's photo.

`regions/central.jpg` is the Mahakaleshwar photo (Madhya Pradesh), which is accurate for Central.

## Rules for the build

- Always render through `next/image` with explicit `sizes` so later Cloudinary images are
  responsive. Suggested: temple cards `(max-width: 640px) 44vw, (max-width: 980px) 30vw, 230px`.
- Store the image path on the temple record (`imageUrl` or whatever the schema calls it) so
  swapping to Cloudinary is a data change, not a code change.
- Keep `object-fit: cover` and the card aspect ratios; new photos should be at least
  1200×1500 (portrait cards) and 2400×1400 (hero).
