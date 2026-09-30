'use client'

import { Switch as SwitchPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Toggle switch on Radix Switch (role="switch", Space/Enter to toggle). Saffron when on
 * (HOMEPAGE_SPEC.md "Cookie consent"). Both track colours stay ≥ 3:1 against the page
 * so the state is visible without colour alone being faint. Label it with <label htmlFor>
 * or aria-labelledby. An invisible 8px extension (::after) makes the touch target 44px tall.
 */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 after:absolute after:-inset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-saffron-deep data-[state=unchecked]:bg-muted-ink',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-6 rounded-full bg-white shadow-soft transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  )
}
