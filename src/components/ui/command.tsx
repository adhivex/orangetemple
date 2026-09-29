'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Command palette primitives (cmdk): a filterable list with arrow-key navigation and
 * aria-activedescendant. The temple search overlay (design phase D5) composes these
 * inside a full-screen sheet on phones and a Dialog from tablet up.
 */

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn('flex size-full flex-col overflow-hidden bg-surface text-ink', className)}
      {...props}
    />
  )
}

export function CommandInput({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-5">
      <SearchIcon className="size-5 shrink-0 text-saffron-ink" aria-hidden="true" />
      <CommandPrimitive.Input
        className={cn(
          'h-14 w-full min-w-0 bg-transparent font-serif text-[1.375rem] text-ink outline-none placeholder:text-muted-ink disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn('flex-1 overflow-y-auto overscroll-contain', className)}
      {...props}
    />
  )
}

export function CommandEmpty({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn('px-5 py-8 text-center text-body text-ink-2', className)}
      {...props}
    />
  )
}

export function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        '[&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-label [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-ink [&_[cmdk-group-heading]]:uppercase',
        className,
      )}
      {...props}
    />
  )
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'flex min-h-13 cursor-pointer items-center justify-between gap-4 border-b border-line px-5 py-3 outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface-alt',
        className,
      )}
      {...props}
    />
  )
}
