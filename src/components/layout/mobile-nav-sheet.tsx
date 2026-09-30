'use client'

import { useSyncExternalStore } from 'react'
import { toast } from 'sonner'

import { NavItem } from '@/components/navigation/nav-item'
import { InstallCard } from '@/components/pwa/install-card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { soon } from '@/content/home'
import { sheetNav } from '@/lib/site-config'

const TABLET_UP = '(min-width: 641px)'

function subscribe(callback: () => void) {
  const query = window.matchMedia(TABLET_UP)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

/**
 * The menu (MOBILE_WEBAPP.md §4, §6): a bottom sheet on phones and a 380px right-side
 * sheet on tablets, opened by the header's menu button or the tab bar's "More". Serif
 * links, Sign In ("coming soon") and the install card. Loaded on first use by
 * <ShellProvider>; focus returns to whichever button opened it.
 */
export function MobileNavSheet({
  open,
  onOpenChange,
  onClosed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClosed: () => void
}) {
  const tabletUp = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(TABLET_UP).matches,
    () => false,
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={tabletUp ? 'right' : 'bottom'}
        closeLabel="Close menu"
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onClosed()
        }}
        className="px-[22px] tablet:px-[26px] tablet:pt-[calc(env(safe-area-inset-top)+18px)]"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav
          aria-label="Menu"
          className="flex flex-1 flex-col overflow-y-auto overscroll-contain pt-2 pb-[calc(env(safe-area-inset-bottom)+22px)] tablet:pt-12"
        >
          <ul>
            {sheetNav.map((item) => (
              <li key={item.label} className="border-b border-line">
                <NavItem
                  item={item}
                  onSelect={() => onOpenChange(false)}
                  className="flex min-h-14 w-full items-center py-[13px] text-left font-serif text-[22px] font-medium text-ink aria-[current=page]:text-saffron-ink tablet:py-4 tablet:text-[26px]"
                />
              </li>
            ))}
          </ul>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              onOpenChange(false)
              toast(soon.signIn)
            }}
          >
            Sign In
          </Button>
          <InstallCard />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
