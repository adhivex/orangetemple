import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about our custom type-scale utilities so that
// `text-body` and `text-charcoal-900` are not treated as conflicting.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'body', 'small', 'label'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
