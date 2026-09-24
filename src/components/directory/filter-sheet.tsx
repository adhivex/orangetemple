'use client'

import { SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

/**
 * Mobile filters in a bottom sheet (DESIGN-SYSTEM.md §5). The form itself is a Server
 * Component passed as children; the sheet only mounts it while open, so it never
 * duplicates the inline desktop form in the DOM.
 */
export function FilterSheet({
  activeCount,
  children,
}: {
  activeCount: number
  children: ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 inline-flex size-6 items-center justify-center rounded-full bg-saffron-500 text-small text-charcoal-900">
              {activeCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel="Close filters">
        <SheetHeader>
          <SheetTitle>Filter temples</SheetTitle>
          <SheetDescription>Combine filters to narrow the directory.</SheetDescription>
        </SheetHeader>
        <SheetBody>{children}</SheetBody>
      </SheetContent>
    </Sheet>
  )
}
