import type { Metadata } from 'next'
import { Suspense } from 'react'

import {
  ActiveFilters,
  DirectoryEmpty,
  DirectorySkeleton,
} from '@/components/directory/directory-states'
import { FilterForm } from '@/components/directory/filter-form'
import { FilterSheet } from '@/components/directory/filter-sheet'
import { Pagination } from '@/components/directory/pagination'
import { SearchForm } from '@/components/directory/search-form'
import { TempleCard } from '@/components/temple/temple-card'
import {
  activeFilterCount,
  hasSearchOrFilter,
  PAGE_SIZE,
  parseDirectoryParams,
} from '@/lib/directory'
import { directoryHref } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'
import { getFilterOptions, searchTemples } from '@/server/directory'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/**
 * Robots and canonical rules (ROUTES.md §4): any search or filter → noindex, follow,
 * canonical /temples. ?page=N alone is self-canonical and indexable.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const filters = parseDirectoryParams(await searchParams)
  const filtered = hasSearchOrFilter(filters)
  const paged = !filtered && filters.page > 1
  return {
    ...pageMetadata({
      title: paged ? `Temples — page ${filters.page}` : 'Temples',
      description:
        'Search and browse the sacred temples of Bharat by name, deity, state, region and collection.',
      path: filtered ? '/temples' : directoryHref({ page: filters.page }),
    }),
    // Also sent as an X-Robots-Tag header (D-038): this metadata streams into <body>.
    robots: filtered ? { index: false, follow: true } : undefined,
  }
}

/** Temple directory (PRD §6): search, filters, 24 per page, server-rendered per request. */
export default function TemplesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <header className="container-wide pt-10 pb-6 md:pt-14">
        <p className="flex items-center gap-3 text-label font-medium text-saffron-800 uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
          Directory
        </p>
        <h1 className="mt-3 text-h1 text-charcoal-900">Temples</h1>
        <p className="mt-3 measure text-charcoal-700">
          Search by name, town or state, or narrow the list by deity, region and collection.
        </p>
      </header>
      <Suspense fallback={<DirectorySkeleton />}>
        <Directory searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function Directory({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseDirectoryParams(await searchParams)
  const [result, options] = await Promise.all([searchTemples(filters), getFilterOptions()])
  const current = { ...filters, page: result.page }
  const first = (result.page - 1) * PAGE_SIZE + 1
  const last = first + result.temples.length - 1

  return (
    <div className="container-wide pb-16 md:pb-24">
      <SearchForm filters={current} />
      <div className="mt-4 lg:hidden">
        <FilterSheet activeCount={activeFilterCount(current)}>
          <FilterForm options={options} filters={current} idPrefix="sheet" />
        </FilterSheet>
      </div>
      <ActiveFilters filters={current} options={options} />

      <div className="mt-8 lg:grid lg:grid-cols-[17rem_1fr] lg:items-start lg:gap-10">
        <aside aria-labelledby="filters-title" className="hidden lg:sticky lg:top-24 lg:block">
          <h2
            id="filters-title"
            className="mb-5 font-sans text-label font-medium text-stone-600 uppercase"
          >
            Filters
          </h2>
          <FilterForm options={options} filters={current} idPrefix="panel" />
        </aside>

        <section aria-labelledby="results-title">
          <h2
            id="results-title"
            className="font-sans text-small font-normal text-stone-600"
            aria-live="polite"
          >
            {result.total === 0
              ? 'No results'
              : result.pageCount > 1
                ? `Showing ${first}–${last} of ${result.total} temples`
                : `${result.total} ${result.total === 1 ? 'temple' : 'temples'}`}
          </h2>

          {result.temples.length === 0 ? (
            <div className="mt-6">
              <DirectoryEmpty filters={current} />
            </div>
          ) : (
            <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {result.temples.map((temple) => (
                <li key={temple.slug}>
                  <TempleCard temple={temple} aspect="3/2" />
                </li>
              ))}
            </ul>
          )}

          <Pagination filters={current} page={result.page} pageCount={result.pageCount} />
        </section>
      </div>
    </div>
  )
}
