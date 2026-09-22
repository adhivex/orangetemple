import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Buttons (DESIGN-SYSTEM.md §8). Every size meets the 44×44px touch target.
 * - primary:   saffron-700 fill, white text (4.78:1)
 * - accent:    saffron-500 fill, charcoal text (6.98:1) — never white on saffron-500
 * - secondary: neutral outline
 * - ghost:     no chrome, for icon buttons in bars
 * - inverse:   outline for dark surfaces
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-sans font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-saffron-700 text-white hover:bg-saffron-800',
        accent:
          'bg-saffron-500 text-charcoal-900 hover:bg-[color-mix(in_oklab,var(--saffron-500)_88%,var(--charcoal-900))]',
        secondary:
          'border border-charcoal-900/20 bg-transparent text-charcoal-900 hover:border-charcoal-900/40 hover:bg-sand-100',
        ghost: 'text-charcoal-900 hover:bg-sand-100',
        inverse:
          'border border-ivory-50/30 text-ivory-50 hover:border-ivory-50/60 hover:bg-ivory-50/10',
      },
      size: {
        default: 'h-12 px-6 text-[1rem] [&_svg]:size-[1.125rem]',
        sm: 'h-11 px-4 text-small [&_svg]:size-4',
        lg: 'h-14 px-8 text-[1.0625rem] [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-[1.375rem]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
