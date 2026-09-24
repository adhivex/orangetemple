import { defineCollection } from './schema'

/** Launch collections (SEED-DATA.md §1 ordering, §7; CONTENT-MODEL.md §5; D-018). */
export const collections = [
  defineCollection({
    slug: 'jyotirlingas',
    name: '12 Jyotirlingas',
    subtitle: 'The twelve shrines of Shiva as a pillar of light',
    description:
      'The twelve Jyotirlingas: shrines where Shiva is worshipped as a jyotirlinga, a linga of light.',
    introduction: `The twelve Jyotirlingas are among the most revered shrines of Shiva. At each, Shiva is worshipped as a *jyotirlinga*, a linga of light. Tradition names the twelve in a well-known verse, and together they span the length and breadth of Bharat, from the western coast of Gujarat to the Himalaya and the southern tip of the peninsula.

For a few of the twelve, more than one site is associated with the same name in different traditions. OrangeTemple lists the site most commonly identified, and notes the other claims respectfully on the temple's page.`,
    displayOrder: 1,
    temples: [
      'somnath',
      'mallikarjuna-srisailam',
      'mahakaleshwar-ujjain',
      'omkareshwar',
      'kedarnath',
      'bhimashankar',
      'kashi-vishwanath',
      'trimbakeshwar',
      'baidyanath-deoghar',
      'nageshwar-dwarka',
      'rameshwaram',
      'grishneshwar',
    ],
    related: ['char-dham'],
    review: { reviewed: false, notes: ['Introduction drafted by Claude; needs review.'] },
  }),
  defineCollection({
    slug: 'char-dham',
    name: 'Char Dham',
    subtitle: 'The four dhams: Badrinath, Dwarka, Puri and Rameshwaram',
    description:
      'The four dhams of Badrinath, Dwarka, Puri and Rameshwaram, traditionally associated with the four directions.',
    introduction: `The Char Dham, the "four abodes", are Badrinath in the north, Dwarka in the west, Puri in the east and Rameshwaram in the south. They are traditionally associated with the four directions, and a pilgrimage to all four is held in great esteem.

This collection is different from the **Chota Char Dham** of Uttarakhand — Yamunotri, Gangotri, Kedarnath and Badrinath — a Himalayan circuit that is also often called the "Char Dham". Badrinath belongs to both.`,
    displayOrder: 2,
    temples: ['badrinath', 'dwarkadhish-dwarka', 'jagannath-puri', 'rameshwaram'],
    related: ['jyotirlingas'],
    review: { reviewed: false, notes: ['Introduction drafted by Claude; needs review.'] },
  }),
]
