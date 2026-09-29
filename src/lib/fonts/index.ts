import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

/* Approved v1 type pair (docs/design/code/fonts.ts, D-046). */

/** Display and headings; italic for quotes. */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

/** Body and UI. */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-dm-sans',
})
