import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export type BreadcrumbItem = { name: string; href?: string }

/**
 * Breadcrumbs for deeper pages (ROUTES.md §4.8). The last item is the current page.
 * The same items feed the BreadcrumbList JSON-LD in Phase 8.
 */
export function Breadcrumbs({
  items,
  tone = 'default',
  className,
}: {
  items: BreadcrumbItem[]
  /** `inverse` for use over a dark hero scrim. */
  tone?: 'default' | 'inverse'
  className?: string
}) {
  const inverse = tone === 'inverse'
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 text-small">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-x-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline',
                    inverse
                      ? 'text-surface/90 hover:text-surface'
                      : 'text-muted-ink hover:text-ink',
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={cn(
                    'inline-flex min-h-11 items-center',
                    inverse ? 'text-surface' : 'text-ink',
                  )}
                >
                  {item.name}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    'size-3.5 shrink-0',
                    inverse ? 'text-surface/70' : 'text-muted-ink',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
