import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import type { DirectoryFilters } from '@/lib/directory'
import { directoryHref } from '@/lib/routes'
import { cn } from '@/lib/utils'

/** Page numbers to show: first, last, and a window around the current page. */
export function pageWindow(page: number, pageCount: number, radius = 1): (number | 'gap')[] {
  const pages = new Set([1, pageCount])
  for (let p = page - radius; p <= page + radius; p++) if (p >= 1 && p <= pageCount) pages.add(p)
  const sorted = [...pages].sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push('gap')
    out.push(p)
  })
  return out
}

/** Server-side pagination with real links (PRD §6). Hidden when there is one page. */
export function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: DirectoryFilters
  page: number
  pageCount: number
}) {
  if (pageCount <= 1) return null
  const href = (p: number) => directoryHref({ ...filters, page: p })
  const cell =
    'inline-flex size-11 items-center justify-center rounded-button text-charcoal-900 hover:bg-sand-100'

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={cell} aria-label="Previous page">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(cell, 'opacity-40')} aria-hidden="true">
          <ChevronLeft className="size-5" />
        </span>
      )}
      <ol className="flex items-center gap-1">
        {pageWindow(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-stone-600">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  cell,
                  p === page && 'bg-charcoal-900 text-ivory-50 hover:bg-charcoal-900',
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next" className={cell} aria-label="Next page">
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(cell, 'opacity-40')} aria-hidden="true">
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  )
}
