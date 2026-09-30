'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { NOTIFY_EVENT } from '@/lib/notify'

// Sonner and its styles load on the first notify(), not with the page.
const ToasterHost = dynamic(() => import('./toaster-host').then((m) => m.ToasterHost), {
  ssr: false,
})

/** Mounted once in the root layout; renders nothing until the first toast. */
export function LazyToaster() {
  const [needed, setNeeded] = useState(false)
  useEffect(() => {
    const load = () => setNeeded(true)
    window.addEventListener(NOTIFY_EVENT, load, { once: true })
    return () => window.removeEventListener(NOTIFY_EVENT, load)
  }, [])
  return needed ? <ToasterHost /> : null
}
