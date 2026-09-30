'use client'

import { useRef, type ReactNode } from 'react'

import { useSearch } from './search-provider'

/** A button that opens the temple search overlay (D-048). */
export function SearchButton({
  className,
  children,
  'aria-label': ariaLabel,
}: {
  className?: string
  children: ReactNode
  'aria-label'?: string
}) {
  const { open, openSearch, prefetchSearch } = useSearch()
  const button = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={button}
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={open}
      onPointerEnter={prefetchSearch}
      onFocus={prefetchSearch}
      onClick={() => openSearch(button.current)}
      className={className}
    >
      {children}
    </button>
  )
}
