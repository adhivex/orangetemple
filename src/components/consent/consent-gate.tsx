'use client'

import type { ReactNode } from 'react'

import type { ConsentCategory } from '@/lib/consent'

import { useConsent } from './cookie-consent-provider'

/**
 * Renders its children (for example an analytics script) only after the visitor has
 * allowed `category` (D-051). Before a choice, and after consent is withdrawn, nothing
 * renders, so the script is never requested.
 */
export function ConsentGate({
  category,
  children,
}: {
  category: ConsentCategory
  children: ReactNode
}) {
  const { consent } = useConsent()
  return consent?.[category] ? children : null
}
