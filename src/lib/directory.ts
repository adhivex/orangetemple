import { REGIONS } from '@/lib/regions'

/** 24 results per page (PRD §6). */
export const PAGE_SIZE = 24

/** Longest search query we act on; anything longer is truncated. */
export const MAX_QUERY_LENGTH = 100

export type DirectoryFilters = {
  q?: string
  deity?: string
  state?: string
  /** URL value, e.g. "north". */
  region?: string
  collection?: string
  page: number
}

export type FilterOption = { value: string; label: string }

export type FilterOptions = {
  deities: FilterOption[]
  states: FilterOption[]
  regions: FilterOption[]
  collections: FilterOption[]
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

type RawParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Parses /temples query parameters (ROUTES.md §3). Invalid values are ignored rather
 * than rejected, so a bad URL shows results or an empty state, never an error page.
 */
export function parseDirectoryParams(params: RawParams): DirectoryFilters {
  const q = first(params.q)?.trim().slice(0, MAX_QUERY_LENGTH)
  const slugOrUndefined = (value: string | undefined) =>
    value && SLUG.test(value) ? value : undefined
  const region = first(params.region)
  const page = Number.parseInt(first(params.page) ?? '1', 10)

  return {
    q: q || undefined,
    deity: slugOrUndefined(first(params.deity)),
    state: slugOrUndefined(first(params.state)),
    region: REGIONS.some((r) => r.param === region) ? region : undefined,
    collection: slugOrUndefined(first(params.collection)),
    page: Number.isFinite(page) && page >= 1 && page <= 10_000 ? page : 1,
  }
}

/** Any search or filter present? Such URLs are `noindex, follow` (ROUTES.md §4.3). */
export function hasSearchOrFilter(filters: DirectoryFilters) {
  return Boolean(
    filters.q || filters.deity || filters.state || filters.region || filters.collection,
  )
}

export function activeFilterCount(filters: DirectoryFilters) {
  return [filters.deity, filters.state, filters.region, filters.collection].filter(Boolean).length
}
