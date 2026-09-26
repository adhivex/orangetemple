'use client'

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'

/**
 * Vercel Web Analytics (D-021): cookieless page views, no third-party scripts. Query
 * strings are dropped before sending, so directory searches and filters are never
 * recorded; only the path is.
 */
function withoutQuery(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url)
  url.search = ''
  return { ...event, url: url.toString() }
}

export function SiteAnalytics() {
  return <Analytics beforeSend={withoutQuery} />
}
