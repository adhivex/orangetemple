'use client'

import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

/*
 * Toasts ("coming soon", cookie choices, connectivity). Light theme only (D-046), so no
 * theme provider. On phones they sit above the bottom tab bar and its safe area.
 */
export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      mobileOffset={{
        bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 1.25rem)',
      }}
      toastOptions={{
        classNames: {
          toast:
            '!rounded-panel !border !border-line !bg-surface !font-sans !text-[0.9375rem] !text-ink !shadow-soft',
          description: '!text-ink-2',
        },
      }}
      {...props}
    />
  )
}
