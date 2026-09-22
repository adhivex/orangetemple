# OrangeTemple — Seed Data Specification

The 15 launch temples, their states, deities and collections. Seed files live in the repository and are upserted by slug with `pnpm db:seed` (D-002).

**Everything here is a proposal for the owner to confirm before Phase 2** (see `DECISIONS.md`, open items). Native names and identifications are candidates and must be verified against reliable sources.

## 1. The 15 temples
| # | Working name | Slug | Place | State | Region | Deity | Collections |
|---|---|---|---|---|---|---|---|
| 1 | Somnath Temple | `somnath` | Prabhas Patan, Veraval | Gujarat | West | Shiva | Jyotirlingas |
| 2 | Mallikarjuna Temple, Srisailam | `mallikarjuna-srisailam` | Srisailam | Andhra Pradesh | South | Shiva | Jyotirlingas |
| 3 | Mahakaleshwar Temple | `mahakaleshwar-ujjain` | Ujjain | Madhya Pradesh | Central | Shiva | Jyotirlingas |
| 4 | Omkareshwar Temple | `omkareshwar` | Omkareshwar, Khandwa | Madhya Pradesh | Central | Shiva | Jyotirlingas |
| 5 | Kedarnath Temple | `kedarnath` | Kedarnath, Rudraprayag | Uttarakhand | North | Shiva | Jyotirlingas |
| 6 | Bhimashankar Temple | `bhimashankar` | Bhimashankar, Pune district | Maharashtra | West | Shiva | Jyotirlingas |
| 7 | Kashi Vishwanath Temple | `kashi-vishwanath` | Varanasi | Uttar Pradesh | North | Shiva | Jyotirlingas |
| 8 | Trimbakeshwar Temple | `trimbakeshwar` | Trimbak, Nashik district | Maharashtra | West | Shiva | Jyotirlingas |
| 9 | Baidyanath Temple, Deoghar | `baidyanath-deoghar` | Deoghar | Jharkhand | East | Shiva | Jyotirlingas |
| 10 | Nageshwar Temple | `nageshwar-dwarka` | Near Dwarka | Gujarat | West | Shiva | Jyotirlingas |
| 11 | Rameshwaram (Ramanathaswamy Temple) | `rameshwaram` | Rameswaram | Tamil Nadu | South | Shiva | **Jyotirlingas and Char Dham** |
| 12 | Grishneshwar Temple | `grishneshwar` | Verul (Ellora), near Chhatrapati Sambhajinagar | Maharashtra | West | Shiva | Jyotirlingas |
| 13 | Badrinath Temple | `badrinath` | Badrinath, Chamoli | Uttarakhand | North | Vishnu | Char Dham |
| 14 | Dwarkadhish Temple | `dwarkadhish-dwarka` | Dwarka | Gujarat | West | Krishna | Char Dham |
| 15 | Jagannath Temple, Puri | `jagannath-puri` | Puri | Odisha | East | Jagannath | Char Dham |

Check: 12 Jyotirlingas + 4 Char Dham − 1 shared (Rameshwaram) = 15 temples, 16 memberships.

### Ordering
- **Jyotirlingas** (display order 1–12): Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Baidyanath, Nageshwar, Rameshwaram, Grishneshwar.
- **Char Dham** (display order 1–4): Badrinath, Dwarkadhish (Dwarka), Jagannath (Puri), Rameshwaram.

## 2. Candidate native names (Devanagari, verify)
सोमनाथ · मल्लिकार्जुन · महाकालेश्वर · ओंकारेश्वर · केदारनाथ · भीमाशंकर · काशी विश्वनाथ · त्र्यम्बकेश्वर · बैद्यनाथ · नागेश्वर · रामेश्वरम · घृष्णेश्वर · बद्रीनाथ · द्वारकाधीश · जगन्नाथ (in the order of the table).

## 3. Suggested alternate names (for search)
- Rameshwaram: Rameswaram, Ramanathaswamy
- Kashi Vishwanath: Kashi, Varanasi, Benares, Vishwanath
- Mallikarjuna: Srisailam, Srisailam Mallikarjuna
- Baidyanath: Vaidyanath, Baba Baidyanath Dham, Deoghar
- Nageshwar: Nageshvara
- Grishneshwar: Ghrishneshwar, Ellora, Verul
- Trimbakeshwar: Trimbak, Tryambakeshwar
- Omkareshwar: Onkareshwar
- Kedarnath: Kedarnatha
- Badrinath: Badrinarayan
- Dwarkadhish: Dwarka, Dwarkadheesh
- Jagannath: Puri, Puri Jagannath
- Somnath: Somanatha, Prabhas Patan
- Mahakaleshwar: Mahakal, Ujjain

## 4. Disputed and ambiguous sites (D-019)
Several Jyotirlinga names are traditionally claimed by more than one site. The identifications above are the commonly listed ones and must be confirmed by the owner. Each affected temple gets a respectful `locationNote`.
- **Nageshwar**: commonly identified near Dwarka, Gujarat. Other sites, such as Aundha Nagnath in Maharashtra and Jageshwar in Uttarakhand, are also associated with the name in some traditions.
- **Baidyanath**: commonly identified at Deoghar, Jharkhand. Other sites, such as Parli Vaijnath in Maharashtra and Baijnath in Himachal Pradesh, are also associated with the name in some traditions.
- **Bhimashankar and Grishneshwar**: check whether alternate claims warrant a `locationNote`.

Because Baidyanath and Nageshwar are disputed, their slugs include the city that this site identifies.

## 5. Deities
Seed: Shiva (Shaiva), Vishnu (Vaishnava), Devi (Shakta), Krishna (Vaishnava), Rama (Vaishnava), Hanuman, Ganesha, Jagannath (Vaishnava). Mark the first seven as `isFeatured` in that order.
At launch only Shiva (12), Vishnu (1), Krishna (1) and Jagannath (1) have temples. Tiles with no published temples are hidden (D-007).

## 6. States and regions used at launch
Gujarat (West), Maharashtra (West), Madhya Pradesh (Central), Uttar Pradesh (North), Uttarakhand (North), Andhra Pradesh (South), Tamil Nadu (South), Jharkhand (East), Odisha (East). Northeast has no temples at launch and is hidden. Region assignment for Uttar Pradesh follows the convention in this file; keep it consistent.

## 7. Collections
- **12 Jyotirlingas** (`jyotirlingas`): introduction per `CONTENT-MODEL.md`.
- **Char Dham** (`char-dham`): subtitle "The four dhams: Badrinath, Dwarka, Puri and Rameshwaram". The introduction must state the difference from the Uttarakhand Chota Char Dham (D-018).

## 8. Seeding rules
1. **Level 1 (required for every temple):** name, slug, native name (if verified), alternate names, deity, state, city, short description and overview written in original, cautious wording.
2. **Coordinates:** only from a cited source (for example OpenStreetMap, Wikidata or an official site), stored with `coordinatesSource`. If not verifiable, leave `latitude` and `longitude` empty. Never guess.
3. **Visit information:** leave empty unless sourced with a URL and a date. Never invent timings or rules.
4. **Long-form sections** (history, legend, architecture, rituals, festivals): may be drafted from well-established knowledge in original wording, with legends kept separate from documented history, and marked unreviewed.
5. **References:** only real, checkable sources. If none are available yet, the temple cannot be marked reviewed.
6. **Images:** development may use neutral placeholders flagged `isPlaceholder`. Production must have none.
7. **Review gate (D-020):** each seed record has `reviewed: true|false`. `SEED_TARGET=production` publishes only `reviewed: true` records; other targets publish all records.
8. **Idempotent:** running the seed twice produces no duplicates, keyed by slug. Rameshwaram exists exactly once.
9. Add a Vitest test that validates the seed files: 15 temples, unique slugs, exactly one Rameshwaram, correct collection memberships, required fields present.
