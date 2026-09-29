import type { DeitySeed } from './schema'

/**
 * Presiding deities (SEED-DATA.md §5). The first seven are featured, in this order.
 * Traditions are set only where widely uncontroversial. Descriptions are deliberately
 * brief and make no theological claims.
 */
export const deities: DeitySeed[] = [
  {
    slug: 'shiva',
    name: 'Shiva',
    description:
      'One of the principal deities of Hinduism, worshipped at the twelve Jyotirlingas and at temples across Bharat.',
    tradition: 'SHAIVA',
    isFeatured: true,
    displayOrder: 1,
  },
  {
    slug: 'vishnu',
    name: 'Vishnu',
    description: 'One of the principal deities of Hinduism, worshipped in many forms and names.',
    tradition: 'VAISHNAVA',
    isFeatured: true,
    displayOrder: 2,
  },
  {
    slug: 'devi',
    name: 'Devi',
    description: 'The Goddess, worshipped in many forms across Bharat.',
    tradition: 'SHAKTA',
    isFeatured: true,
    displayOrder: 3,
  },
  {
    slug: 'krishna',
    name: 'Krishna',
    description: 'Widely worshipped as a form of Vishnu, and honoured at Dwarka as its king.',
    tradition: 'VAISHNAVA',
    isFeatured: true,
    displayOrder: 4,
  },
  {
    slug: 'rama',
    name: 'Rama',
    description: 'Widely worshipped as a form of Vishnu, and the hero of the Ramayana.',
    tradition: 'VAISHNAVA',
    isFeatured: true,
    displayOrder: 5,
  },
  {
    slug: 'hanuman',
    name: 'Hanuman',
    description: 'Revered for his devotion to Rama, and for his strength and courage.',
    tradition: null,
    isFeatured: true,
    displayOrder: 6,
  },
  {
    slug: 'ganesha',
    name: 'Ganesha',
    description:
      'Honoured as the remover of obstacles, and invoked at the start of new undertakings.',
    tradition: null,
    isFeatured: true,
    displayOrder: 7,
  },
  {
    slug: 'jagannath',
    name: 'Jagannath',
    description:
      'Worshipped at Puri as "Lord of the Universe", together with Balabhadra and Subhadra.',
    tradition: 'VAISHNAVA',
    isFeatured: false,
    displayOrder: 8,
  },
]
