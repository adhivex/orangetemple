import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from 'next/font/google'

/*
 * Devanagari faces for native-script text only (D-016, ARCHITECTURE.md §10).
 * Not preloaded: the browser fetches them only when lang="hi" text actually renders,
 * so pages that merely import <NativeName> (via TempleCard) pay nothing.
 */
export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['500'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif-deva',
})

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-sans-deva',
})
