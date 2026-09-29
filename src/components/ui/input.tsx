import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Text input. Pill-shaped, 48px tall, and 16px text so iOS does not zoom on focus
 * (MOBILE_WEBAPP.md §3). Callers set type, inputMode, autoComplete and enterKeyHint.
 */
export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'h-12 w-full min-w-0 rounded-button border border-line bg-surface-alt px-5 text-[1rem] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted-ink focus-visible:border-saffron-ink focus-visible:ring-2 focus-visible:ring-saffron-ink/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-saffron-deep',
        className,
      )}
      {...props}
    />
  )
}
