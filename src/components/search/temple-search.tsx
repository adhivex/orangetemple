'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ArrowRightIcon, SearchIcon } from '@/components/icons'
import { directoryHref, templeHref } from '@/lib/routes'
import { filterTemples, type SearchEntry } from '@/lib/temple-search'
import { useOverlayHistory } from '@/lib/use-overlay-history'

const ALL_RESULTS = '__all__'

/**
 * Temple search overlay (HOMEPAGE_SPEC.md "Search overlay", MOBILE_WEBAPP.md §4, D-048).
 * Phones: full screen, with the search row and a Cancel button in the safe area and
 * full-width result rows of at least 52px. Tablet and up: a centred dialog. Results
 * filter as you type (name, state, region, collection); arrow keys move, Enter opens.
 * Esc, the scrim, Cancel and the Back gesture close it. Loaded on demand.
 */
export function TempleSearch({
  entries,
  open,
  initialQuery,
  onOpenChange,
  onClosed,
}: {
  entries: SearchEntry[]
  open: boolean
  initialQuery: string
  onOpenChange: (open: boolean) => void
  onClosed: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const history = useOverlayHistory(open, () => onOpenChange(false))

  // A new opening starts from the query it was opened with.
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => setQuery(initialQuery), 0)
    return () => clearTimeout(timer)
  }, [open, initialQuery])

  const results = filterTemples(entries, query)

  const go = (href: string) => {
    // Replace the overlay's history entry with the destination.
    history.release()
    onOpenChange(false)
    router.replace(href)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] hidden bg-night/55 backdrop-blur-[6px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 tablet:block" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            onClosed()
          }}
          className="fixed inset-0 z-[70] flex h-dvh flex-col bg-surface pt-[env(safe-area-inset-top)] text-ink outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 tablet:inset-x-4 tablet:top-[calc(env(safe-area-inset-top)+90px)] tablet:bottom-auto tablet:mx-auto tablet:h-auto tablet:max-h-[70dvh] tablet:max-w-[600px] tablet:overflow-hidden tablet:rounded-panel tablet:pt-0 tablet:shadow-[0_30px_60px_rgb(0_0_0/0.3)] tablet:data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">Search temples</DialogPrimitive.Title>
          <CommandPrimitive
            shouldFilter={false}
            loop
            label="Search temples"
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex items-center gap-2.5 border-b border-line py-1 pr-2.5 pl-[18px] tablet:py-0 tablet:pr-3.5 tablet:pl-5">
              <SearchIcon aria-hidden="true" className="shrink-0 text-[20px] text-muted-ink" />
              <CommandPrimitive.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search temples, states or regions"
                enterKeyHint="search"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-3.5 font-serif text-[20px] text-ink outline-none placeholder:text-muted-ink tablet:py-5 tablet:text-[24px]"
              />
              <DialogPrimitive.Close className="min-h-11 px-1.5 text-[16px] font-medium text-saffron-ink tablet:hidden">
                Cancel
              </DialogPrimitive.Close>
            </div>
            <CommandPrimitive.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] tablet:max-h-[55vh] tablet:py-2">
              {results.length === 0 && (
                // Not cmdk's Empty: the "See all results" row below is always present.
                <p role="status" className="px-5 py-4 text-[14px] text-muted-ink tablet:px-[22px]">
                  No temples match that yet. Try a state like “Gujarat” or a region like “South”.
                </p>
              )}
              {results.map((temple) => (
                <CommandPrimitive.Item
                  key={temple.slug}
                  value={temple.slug}
                  onSelect={() => go(templeHref(temple.slug))}
                  className="flex min-h-[52px] cursor-pointer items-center justify-between gap-2.5 border-b border-line px-5 py-3.5 text-[15px] data-[selected=true]:bg-surface-alt tablet:border-b-0 tablet:px-[22px] tablet:py-[11px] pointer-coarse:tablet:py-3.5"
                >
                  <span>{temple.name}</span>
                  <span className="text-right text-[13px] text-muted-ink">
                    {temple.state} · {temple.groups.join(', ')}
                  </span>
                </CommandPrimitive.Item>
              ))}
              {query.trim() && (
                <CommandPrimitive.Item
                  value={ALL_RESULTS}
                  onSelect={() => go(directoryHref({ q: query }))}
                  className="flex min-h-[52px] cursor-pointer items-center gap-2 px-5 py-3.5 text-[14px] font-medium text-saffron-ink data-[selected=true]:bg-surface-alt tablet:px-[22px]"
                >
                  See all results in the temple directory
                  <ArrowRightIcon aria-hidden="true" />
                </CommandPrimitive.Item>
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
