import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { GetForm } from './get-form'
import type { DirectoryFilters, FilterOption, FilterOptions } from '@/lib/directory'
import { directoryHref } from '@/lib/routes'

type FilterName = 'deity' | 'state' | 'region' | 'collection'

const FIELDS: { name: FilterName; label: string; any: string; options: keyof FilterOptions }[] = [
  { name: 'deity', label: 'Deity', any: 'Any deity', options: 'deities' },
  { name: 'region', label: 'Region', any: 'Any region', options: 'regions' },
  { name: 'state', label: 'State', any: 'Any state', options: 'states' },
  { name: 'collection', label: 'Collection', any: 'Any collection', options: 'collections' },
]

/**
 * Directory filters (PRD §6): deity, region, state, collection. A plain GET form that
 * keeps the search query. Rendered inline on large screens and inside the bottom sheet
 * on mobile; `idPrefix` keeps label/field ids unique.
 */
export function FilterForm({
  options,
  filters,
  idPrefix,
  layout = 'stack',
}: {
  options: FilterOptions
  filters: DirectoryFilters
  idPrefix: string
  layout?: 'stack' | 'bar'
}) {
  return (
    <GetForm action="/temples" aria-label="Filter temples">
      {filters.q && <input type="hidden" name="q" value={filters.q} />}
      <div className={layout === 'bar' ? 'grid grid-cols-4 items-end gap-4' : 'grid gap-5'}>
        {FIELDS.map((field) => (
          <FilterSelect
            key={field.name}
            id={`${idPrefix}-${field.name}`}
            name={field.name}
            label={field.label}
            any={field.any}
            options={options[field.options]}
            value={filters[field.name]}
          />
        ))}
      </div>
      <div className={layout === 'bar' ? 'mt-4 flex justify-end gap-3' : 'mt-6 flex gap-3'}>
        <Button asChild variant="secondary" className={layout === 'bar' ? '' : 'flex-1'}>
          <Link href={directoryHref({ q: filters.q })}>Clear filters</Link>
        </Button>
        <Button type="submit" className={layout === 'bar' ? '' : 'flex-1'}>
          Show results
        </Button>
      </div>
    </GetForm>
  )
}

function FilterSelect({
  id,
  name,
  label,
  any,
  options,
  value,
}: {
  id: string
  name: string
  label: string
  any: string
  options: FilterOption[]
  value: string | undefined
}) {
  return (
    <div>
      <label htmlFor={id} className="text-label font-medium text-stone-600 uppercase">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          name={name}
          defaultValue={value ?? ''}
          className="h-12 w-full appearance-none rounded-button border border-charcoal-900/20 bg-ivory-50 pr-10 pl-4 text-charcoal-900"
        >
          <option value="">{any}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-stone-600"
        />
      </div>
    </div>
  )
}
