import { defineTemple } from '../schema'

export default defineTemple({
  slug: 'nageshwar-dwarka',
  name: 'Nageshwar Temple',
  nameNative: null,
  alternateNames: ['Nageshvara'],
  deity: 'shiva',
  state: 'gujarat',
  city: 'Near Dwarka',
  district: null,
  shortDescription:
    'Commonly identified as one of the twelve Jyotirlingas, the Nageshwar Temple stands near Dwarka on the coast of Gujarat.',
  overview: `The Nageshwar Temple is near Dwarka, in Gujarat. It is commonly identified as the Jyotirlinga of Nageshvara, where Shiva is worshipped as "Lord of the Serpents".`,
  significance: `In its common identification, Nageshwar is one of the twelve Jyotirlingas. Its closeness to Dwarka means many pilgrims visit it together with the Dwarkadhish Temple.`,
  locationNote: `Several sites are associated with the Nageshvara Jyotirlinga. The temple near Dwarka is the identification most commonly listed, but other traditions associate it with **Aundha Nagnath** in Maharashtra or **Jageshwar** in Uttarakhand. OrangeTemple follows the common identification and respects the others.`,
  review: {
    reviewed: false,
    nameNativeCandidate: 'नागेश्वर',
    notes: [
      'Open item 2: confirm the site near Dwarka as the launch identification (D-019).',
      'City is "Near Dwarka" as in SEED-DATA.md; confirm the locality to display.',
    ],
  },
})
