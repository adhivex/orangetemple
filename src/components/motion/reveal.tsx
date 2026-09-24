import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Section entrance (DESIGN-SYSTEM.md §10, D-035): a short fade-and-rise driven by the
 * CSS scroll timeline (`reveal` utility in globals.css). No JavaScript, and content is
 * visible by default: only browsers that support scroll-driven animations, with reduced
 * motion off, animate it. Never wrap the LCP element.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('reveal', className)}>{children}</div>
}
