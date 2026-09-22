'use client'

import { LazyMotion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

const loadFeatures = () => import('./features').then((mod) => mod.default)

/**
 * App-wide motion setup (DESIGN-SYSTEM.md §10, ARCHITECTURE.md §10).
 * - LazyMotion + domAnimation, loaded asynchronously; `strict` forbids the heavy `motion.*` components.
 * - reducedMotion="user" disables transform/layout animation when the OS asks for reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
