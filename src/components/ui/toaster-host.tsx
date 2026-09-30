'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { attachToaster } from '@/lib/notify'

import { Toaster } from './sonner'

/**
 * The Sonner toaster plus the bridge from notify(). Children's effects run first, so the
 * Toaster is listening before queued messages are shown.
 */
export function ToasterHost() {
  useEffect(() => attachToaster((message) => toast(message)), [])
  return <Toaster />
}
