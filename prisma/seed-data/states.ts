import type { StateSeed } from './schema'

/** States with published temples at launch (SEED-DATA.md §6). Add others as needed. */
export const states: StateSeed[] = [
  { slug: 'gujarat', name: 'Gujarat', region: 'WEST' },
  { slug: 'maharashtra', name: 'Maharashtra', region: 'WEST' },
  { slug: 'madhya-pradesh', name: 'Madhya Pradesh', region: 'CENTRAL' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', region: 'NORTH' },
  { slug: 'uttarakhand', name: 'Uttarakhand', region: 'NORTH' },
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh', region: 'SOUTH' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', region: 'SOUTH' },
  { slug: 'jharkhand', name: 'Jharkhand', region: 'EAST' },
  { slug: 'odisha', name: 'Odisha', region: 'EAST' },
]
