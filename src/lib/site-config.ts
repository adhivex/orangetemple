import { soon, type LinkItem } from '@/content/home'

/**
 * Site-wide navigation and identity. Structural only — no temple content lives here.
 * Routes follow docs/ROUTES.md; V1 non-goals open a "coming soon" toast (D-053).
 */
export const siteConfig = {
  name: 'OrangeTemple',
  tagline: 'Sacred temples and spiritual heritage of Bharat',
  /** Logo tagline (docs/design/HOMEPAGE_SPEC.md §1). */
  motto: 'Sacred Bharat. Always with you.',
  description:
    'Discover the sacred temples and spiritual heritage of Bharat — their significance, history, traditions and how to visit.',
} as const

export type NavItem = { href: string; label: string }

/** Header navigation from tablet landscape up (HOMEPAGE_SPEC.md §1). */
export const primaryNav: LinkItem[] = [
  { href: '/', label: 'Home' },
  { href: '/temples', label: 'Temples' },
  { href: '/jyotirlingas', label: 'Jyotirlingas' },
  { href: '/char-dham', label: 'Char Dham' },
  { href: '/explore-bharat', label: 'Explore Bharat' },
  { label: 'Stories', soon: soon.stories },
]

/** The menu sheet (bottom sheet on phones, right sheet on tablets). */
export const sheetNav: LinkItem[] = primaryNav

/** Shortcuts on the 404 page. */
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

/** Whether a nav href is the current page (exact for "/", prefix otherwise). */
export function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}
