'use client'

import { m } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Section-entrance motion: a short fade and rise as the block scrolls into view.
 * Under reduced motion only the opacity fade remains (see MotionProvider).
 * Do not wrap the LCP element in this.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </m.div>
  )
}
