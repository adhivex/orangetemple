import Link from 'next/link'
import type { ReactNode } from 'react'

import { collectionHref } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { TempleDetail } from '@/server/shapes'

type QuickFactsTemple = Pick<
  TempleDetail,
  'city' | 'district' | 'state' | 'deity' | 'collections' | 'estimatedPeriod' | 'architectureStyle'
>

type VerifiedVisit = Pick<
  NonNullable<TempleDetail['visitInfo']>,
  'bestTimeToVisit' | 'seasonalAccess' | 'nearestAirport' | 'nearestRailway'
>

/**
 * Quick facts (CONTENT-MODEL.md §4). Rows without a value are omitted; the whole block
 * is omitted if nothing remains. Visit-derived facts are passed only when the visit
 * information is sourced and recently verified.
 */
export function QuickFacts({
  temple,
  verifiedVisit,
  className,
}: {
  temple: QuickFactsTemple
  verifiedVisit: VerifiedVisit | null
  className?: string
}) {
  const location = [temple.city, temple.district, temple.state.name].filter(Boolean).join(', ')
  const rows: [string, ReactNode][] = [
    ['Presiding deity', temple.deity.name],
    ['Location', location],
    [
      'Collections',
      temple.collections.length > 0 ? (
        <ul className="flex flex-wrap gap-x-3">
          {temple.collections.map(({ collection }) => (
            <li key={collection.slug}>
              <Link
                href={collectionHref(collection.slug)}
                className="text-saffron-800 underline underline-offset-4"
              >
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null,
    ],
    ['Period', temple.estimatedPeriod],
    ['Architecture', temple.architectureStyle],
    ['Best time to visit', verifiedVisit?.bestTimeToVisit],
    ['Seasonal access', verifiedVisit?.seasonalAccess],
    ['Nearest airport', verifiedVisit?.nearestAirport],
    ['Nearest railway station', verifiedVisit?.nearestRailway],
  ]
  const visible = rows.filter(([, value]) => value !== null && value !== undefined && value !== '')
  if (visible.length === 0) return null

  return (
    <dl className={cn('grid gap-x-8 gap-y-5 sm:grid-cols-2', className)}>
      {visible.map(([label, value]) => (
        <div key={label} className="border-t border-border pt-3">
          <dt className="text-label font-medium text-stone-600 uppercase">{label}</dt>
          <dd className="mt-1.5 text-charcoal-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
