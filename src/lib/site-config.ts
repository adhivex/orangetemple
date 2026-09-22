/**
 * Site-wide navigation and identity. Structural only — no temple content lives here.
 * Routes follow docs/ROUTES.md. Stories are not in V1 (D-005).
 */
export const siteConfig = {
  name: 'OrangeTemple',
  tagline: 'Sacred temples and spiritual heritage of Bharat',
  description:
    'Discover the sacred temples and spiritual heritage of Bharat — their significance, history, traditions and how to visit.',
} as const

export type NavItem = { href: string; label: string }

/** Desktop header (DESIGN-SYSTEM.md §4). Search is rendered separately as an icon button. */
export const primaryNav: NavItem[] = [
  { href: '/temples', label: 'Temples' },
  { href: '/jyotirlingas', label: 'Jyotirlingas' },
  { href: '/char-dham', label: 'Char Dham' },
  { href: '/explore-bharat', label: 'Explore Bharat' },
]

/** Search has no route of its own; it opens the directory with the search field focused. */
export const searchHref = '/temples#search'

/** Mobile menu sheet (DESIGN-SYSTEM.md §4). */
export const menuNav: { collections: NavItem[]; site: NavItem[] } = {
  collections: [
    { href: '/jyotirlingas', label: '12 Jyotirlingas' },
    { href: '/char-dham', label: 'Char Dham' },
  ],
  site: [
    { href: '/about', label: 'About' },
    { href: '/credits', label: 'Credits' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy' },
  ],
}

/** Temple detail pages swap the bottom tab bar for the action bar (D-010). */
export function isTempleDetailPath(pathname: string) {
  return /^\/temples\/[^/]+\/?$/.test(pathname)
}
