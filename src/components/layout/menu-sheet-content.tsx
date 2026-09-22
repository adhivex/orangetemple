'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { menuNav, siteConfig } from '@/lib/site-config'

/**
 * Menu sheet body: collections and site pages (DESIGN-SYSTEM.md §4). Loaded on demand
 * by <MenuSheet> so Radix Dialog stays out of every page's first-load JavaScript.
 * Radix returns focus to the menu button when the sheet closes.
 */
export default function MenuSheetContent({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" closeLabel="Close menu">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>{siteConfig.tagline}</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <nav aria-label="Menu">
            <h3 className="mt-2 text-label font-medium text-stone-600 uppercase">Collections</h3>
            <ul className="mt-2 divide-y divide-border border-y border-border">
              {menuNav.collections.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="flex min-h-14 items-center justify-between py-3 font-display text-h3 text-charcoal-900"
                    >
                      {item.label}
                      <ArrowUpRight className="size-5 text-saffron-800" aria-hidden="true" />
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-label font-medium text-stone-600 uppercase">OrangeTemple</h3>
            <ul className="mt-2 grid grid-cols-2 gap-x-4">
              {menuNav.site.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="flex min-h-12 items-center text-charcoal-700 hover:text-charcoal-900"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
