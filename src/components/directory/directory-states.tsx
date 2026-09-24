import { SearchX, X } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { DirectoryFilters, FilterOptions } from '@/lib/directory'
import { collectionHref, directoryHref } from '@/lib/routes'

/** Empty results (DESIGN-SYSTEM.md §11): suggestions and a reset action. */
export function DirectoryEmpty({ filters }: { filters: DirectoryFilters }) {
  return (
    <div className="rounded-card border border-border bg-sand-100/60 px-6 py-12 text-center">
      <SearchX className="mx-auto size-10 text-stone-600" aria-hidden="true" />
      <h2 className="mt-4 text-h3 text-charcoal-900">No temples match</h2>
      <p className="mx-auto mt-3 max-w-md text-charcoal-700">
        {filters.q
          ? `Nothing matched “${filters.q}”. Check the spelling, try another name for the temple or its town, or remove a filter.`
          : 'No temple matches this combination of filters. Try removing one.'}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/temples">Clear search and filters</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={collectionHref('jyotirlingas')}>Browse the 12 Jyotirlingas</Link>
        </Button>
      </div>
    </div>
  )
}

/** Removable chips for the active search and filters. Each chip is a real link. */
export function ActiveFilters({
  filters,
  options,
}: {
  filters: DirectoryFilters
  options: FilterOptions
}) {
  const labelOf = (list: { value: string; label: string }[], value?: string) =>
    list.find((o) => o.value === value)?.label ?? value
  const chips = [
    filters.q && {
      key: 'q',
      label: `“${filters.q}”`,
      href: directoryHref({ ...filters, q: undefined, page: 1 }),
    },
    filters.deity && {
      key: 'deity',
      label: labelOf(options.deities, filters.deity),
      href: directoryHref({ ...filters, deity: undefined, page: 1 }),
    },
    filters.region && {
      key: 'region',
      label: labelOf(options.regions, filters.region),
      href: directoryHref({ ...filters, region: undefined, page: 1 }),
    },
    filters.state && {
      key: 'state',
      label: labelOf(options.states, filters.state),
      href: directoryHref({ ...filters, state: undefined, page: 1 }),
    },
    filters.collection && {
      key: 'collection',
      label: labelOf(options.collections, filters.collection),
      href: directoryHref({ ...filters, collection: undefined, page: 1 }),
    },
  ].filter((c): c is { key: string; label: string; href: string } => Boolean(c))

  if (chips.length === 0) return null
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active search and filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={chip.href}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-charcoal-900/20 bg-ivory-50 pr-3 pl-4 text-small font-medium text-charcoal-900 hover:border-charcoal-900/40"
          >
            {chip.label}
            <X className="size-4 text-stone-600" aria-hidden="true" />
            <span className="sr-only">(remove)</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Loading skeleton matching the final layout (DESIGN-SYSTEM.md §11). */
export function DirectorySkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="container-wide pb-16">
      <span className="sr-only">Loading temples…</span>
      <div aria-hidden="true">
        <div className="h-13 w-full animate-pulse rounded-full bg-sand-100" />
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:ml-[20rem] xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <div className="aspect-[3/2] animate-pulse rounded-card bg-sand-100" />
              <div className="mt-4 h-4 w-24 animate-pulse rounded bg-sand-100" />
              <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-sand-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-sand-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
