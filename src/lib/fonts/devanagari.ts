import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from 'next/font/google'

/*
 * Devanagari faces for native-script text only (D-016, ARCHITECTURE.md §10).
 * Imported solely by <NativeName>, so the fonts are preloaded only on pages
 * that actually render native-script text.
 */
export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-noto-serif-deva',
})

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-noto-sans-deva',
})
