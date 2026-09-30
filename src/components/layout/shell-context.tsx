'use client'

import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

// The menu sheet (and Radix Dialog with it) loads on first use, keeping it out of every
// page's first-load JavaScript.
const loadMenu = () => import('./mobile-nav-sheet')
const MobileNavSheet = dynamic(() => loadMenu().then((m) => m.MobileNavSheet), { ssr: false })

type ShellContextValue = {
  menuOpen: boolean
  /** Opens the menu; focus returns to `opener` when it closes. */
  openMenu: (opener: HTMLElement | null) => void
  prefetchMenu: () => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function useShell() {
  const value = useContext(ShellContext)
  if (!value) throw new Error('useShell must be used inside <ShellProvider>')
  return value
}

/**
 * App-shell state shared by the header, the tab bar and the menu sheet: the header's
 * menu button and the tab bar's "More" open the same sheet (MOBILE_WEBAPP.md §4).
 */
export function ShellProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const opener = useRef<HTMLElement | null>(null)

  const openMenu = useCallback((element: HTMLElement | null) => {
    opener.current = element
    setMenuMounted(true)
    setMenuOpen(true)
  }, [])
  const prefetchMenu = useCallback(() => void loadMenu(), [])

  const value = useMemo(
    () => ({ menuOpen, openMenu, prefetchMenu }),
    [menuOpen, openMenu, prefetchMenu],
  )

  return (
    <ShellContext.Provider value={value}>
      {children}
      {menuMounted && (
        <MobileNavSheet
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onClosed={() => opener.current?.focus()}
        />
      )}
    </ShellContext.Provider>
  )
}
