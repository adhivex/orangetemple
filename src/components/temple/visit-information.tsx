import { ExternalLink, Info } from 'lucide-react'

import { Markdown } from '@/components/content/markdown'
import { formatMonthYear, shouldShowVisitDetails, VISIT_INFO_NOTICE } from '@/lib/visit-info'
import type { VisitInfoData } from '@/server/shapes'

/**
 * Plan your visit (CONTENT-MODEL.md §3–4). Shows sourced, recently verified visit
 * details with "Last verified {month year}" and the source; otherwise the standard
 * notice, with the official website when one is verified. `now` is passed in so the
 * component stays pure and cacheable.
 */
export function VisitInformation({
  visitInfo,
  officialWebsite,
  now,
}: {
  visitInfo: VisitInfoData | null
  officialWebsite: string | null
  now: Date
}) {
  if (!shouldShowVisitDetails(visitInfo, now)) {
    return (
      <div className="flex gap-3 rounded-card border border-border bg-sand-100/60 p-5">
        <Info className="mt-1 size-5 shrink-0 text-saffron-800" aria-hidden="true" />
        <div>
          <p className="text-charcoal-900">{VISIT_INFO_NOTICE}</p>
          {officialWebsite && (
            <a
              href={officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-saffron-800 underline underline-offset-4"
            >
              Official website
              <ExternalLink className="size-4" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    )
  }

  const rows = [
    ['Timings', visitInfo.timings],
    ['Entry', visitInfo.entryRules],
    ['Dress code', visitInfo.dressCode],
    ['Photography', visitInfo.photographyRules],
    ['Best time to visit', visitInfo.bestTimeToVisit],
    ['Seasonal access', visitInfo.seasonalAccess],
  ].filter((row): row is [string, string] => Boolean(row[1]?.trim()))

  return (
    <div>
      {rows.length > 0 && (
        <dl className="divide-y divide-border border-y border-border">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-medium text-charcoal-900">{label}</dt>
              <dd className="text-charcoal-700">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {visitInfo.howToReach && (
        <div className="mt-8">
          <h3 className="text-h3">How to reach</h3>
          <Markdown source={visitInfo.howToReach} className="mt-3" />
        </div>
      )}
      <p className="mt-6 text-small text-stone-600">
        Last verified {formatMonthYear(visitInfo.lastVerifiedAt!)} ·{' '}
        <a
          href={visitInfo.verificationSourceUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron-800 underline underline-offset-4"
        >
          Source
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        . {VISIT_INFO_NOTICE}
      </p>
    </div>
  )
}
