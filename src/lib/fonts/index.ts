import { Fraunces, Inter } from 'next/font/google'

/** Display and headings (D-016). The opsz axis gives proper optical sizing at display sizes. */
export const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
})

/** Body and UI (D-016). */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
