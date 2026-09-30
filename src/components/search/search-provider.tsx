'use client'

import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { SearchEntry } from '@/lib/temple-search'

// The overlay (cmdk and Radix Dialog) loads on first open or first hover of a trigger.
const loadSearch = () => import('./temple-search')
const TempleSearch = dynamic(() => loadSearch().then((m) => m.TempleSearch), { ssr: false })

type SearchContextValue = {
  open: boolean
  /** Opens the overlay; focus returns to `opener` when it closes. */
  openSearch: (opener?: HTMLElement | null, query?: string) => void
  prefetchSearch: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function useSearch() {
  const value = useContext(SearchContext)
  if (!value) throw new Error('useSearch must be used inside <SearchProvider>')
  return value
}

/**
 * Temple search overlay state (HOMEPAGE_SPEC.md "Search overlay", D-048). Opened by the
 * header, the Search tab, the "All" deity tile and the `/?search=1` app shortcut. The
 * published temples arrive from the server as `entries` and are filtered in the browser.
 */
export function SearchProvider({
  entries,
  children,
}: {
  entries: SearchEntry[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const [opener, setOpener] = useState<HTMLElement | null>(null)

  const openSearch = useCallback((element?: HTMLElement | null, query = '') => {
    setOpener(element ?? null)
    setInitialQuery(query)
    setMounted(true)
    setOpen(true)
  }, [])
  const prefetchSearch = useCallback(() => void loadSearch(), [])

  // The installed app's "Search temples" shortcut opens /?search=1 (manifest.ts).
  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('search') !== '1') return
    url.searchParams.delete('search')
    window.history.replaceState(window.history.state, '', url)
    const timer = setTimeout(() => openSearch(null), 0)
    return () => clearTimeout(timer)
  }, [openSearch])

  const value = useMemo(
    () => ({ open, openSearch, prefetchSearch }),
    [open, openSearch, prefetchSearch],
  )

  return (
    <SearchContext.Provider value={value}>
      {children}
      {mounted && (
        <TempleSearch
          entries={entries}
          open={open}
          initialQuery={initialQuery}
          onOpenChange={setOpen}
          onClosed={() => opener?.focus()}
        />
      )}
    </SearchContext.Provider>
  )
}
