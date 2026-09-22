'use client'

import { XIcon } from 'lucide-react'
import { Dialog as SheetPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Sheet primitive built on Radix Dialog: focus trap, Escape to close, scroll lock,
 * aria-modal and labelling come from Radix. Two placements:
 * - bottom: the mobile bottom sheet (filters, menu). Thumb-zone, safe-area aware.
 * - right:  a side panel for larger screens.
 * Enter/exit animations are CSS (tw-animate-css) and collapse under reduced motion.
 */

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close

export function SheetContent({
  className,
  children,
  side = 'bottom',
  closeLabel = 'Close',
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'bottom' | 'right'
  closeLabel?: string
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-charcoal-900/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col bg-ivory-50 shadow-sheet outline-none data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=open]:duration-300',
          side === 'bottom' &&
            'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[1.25rem] pb-[env(safe-area-inset-bottom)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-[min(26rem,100%)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          className,
        )}
        {...props}
      >
        {side === 'bottom' && (
          <div
            aria-hidden="true"
            className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-charcoal-900/15"
          />
        )}
        {children}
        <SheetPrimitive.Close
          className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full text-charcoal-700 transition-colors hover:bg-sand-100 hover:text-charcoal-900"
          aria-label={closeLabel}
        >
          <XIcon className="size-5" aria-hidden="true" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-5 pt-4 pr-16 pb-3', className)} {...props} />
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn('font-display text-h3 font-medium text-charcoal-900', className)}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description className={cn('text-small text-stone-600', className)} {...props} />
  )
}

export function SheetBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto overscroll-contain px-5 pb-6', className)}
      {...props}
    />
  )
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex gap-3 border-t border-border bg-ivory-50 px-5 py-4', className)}
      {...props}
    />
  )
}
