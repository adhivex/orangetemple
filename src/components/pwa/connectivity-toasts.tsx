'use client'

import { useEffect } from 'react'

import { notify } from '@/lib/notify'

/**
 * Tells the visitor when the connection drops or returns (MOBILE_WEBAPP.md §2). Renders
 * nothing; mounted once in the root layout.
 */
export function ConnectivityToasts() {
  useEffect(() => {
    const offline = () => notify("You're offline, showing saved pages")
    const online = () => notify('Back online')
    window.addEventListener('offline', offline)
    window.addEventListener('online', online)
    return () => {
      window.removeEventListener('offline', offline)
      window.removeEventListener('online', online)
    }
  }, [])
  return null
}
