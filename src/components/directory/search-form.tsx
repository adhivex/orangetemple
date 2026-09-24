import { SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { DirectoryFilters } from '@/lib/directory'
import { MAX_QUERY_LENGTH } from '@/lib/directory'

import { GetForm } from './get-form'

/**
 * Directory search (PRD §6). A plain GET form, so it works before JavaScript loads and
 * every result URL is shareable. Active filters are kept; the page resets to 1.
 * The input's id is the target of /temples#search (D-025).
 */
export function SearchForm({ filters }: { filters: DirectoryFilters }) {
  const kept = {
    deity: filters.deity,
    state: filters.state,
    region: filters.region,
    collection: filters.collection,
  }
  return (
    <GetForm role="search" action="/temples" className="w-full">
      <label htmlFor="search" className="sr-only">
        Search temples by name, city or state
      </label>
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-stone-600"
          aria-hidden="true"
        />
        <input
          id="search"
          name="q"
          type="search"
          defaultValue={filters.q ?? ''}
          maxLength={MAX_QUERY_LENGTH}
          placeholder="Search by name, city or state"
          autoComplete="off"
          enterKeyHint="search"
          className="h-13 w-full rounded-full border border-charcoal-900/20 bg-ivory-50 pr-28 pl-12 text-body text-charcoal-900 placeholder:text-stone-600 focus-visible:border-saffron-800"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full"
        >
          Search
        </Button>
      </div>
      {Object.entries(kept).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null,
      )}
    </GetForm>
  )
}
