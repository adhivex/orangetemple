'use client'

import { MenuIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

const loadContent = () => import('./menu-sheet-content')
const MenuSheetContent = dynamic(loadContent, { ssr: false })

/**
 * Mobile menu button. The sheet (and Radix Dialog with it) is fetched on first
 * hover, focus or touch rather than on page load: the header is on every route,
 * so this keeps ~14 KB gzipped out of every page's first-load JavaScript.
 */
export function MenuSheet() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const prefetch = () => void loadContent()

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
      >
        <MenuIcon aria-hidden="true" />
      </Button>
      {mounted && (
        <MenuSheetContent
          open={open}
          onOpenChange={setOpen}
          onCloseAutoFocus={() => buttonRef.current?.focus()}
        />
      )}
    </>
  )
}
