import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Buttons (docs/design/DESIGN_SYSTEM.md "Components", D-046). Pills; every size meets
 * the 44×44px touch target. Hover effects only apply on hover-capable devices (Tailwind
 * v4 `hover:`); the pressed state scales to 0.97 instead of a tap flash.
 * - default:     saffron-deep → saffron-ink gradient, white text (≥ 4.87:1), inner
 *                highlight and shadow-cta. A trailing icon nudges 3px right on hover.
 * - outline:     neutral outline on light surfaces ("Reject optional").
 * - line:        1px currentColor border, fills saffron-deep on hover (header Sign In).
 * - ghost-light: on photos: white/55% border, light blur, fills white on hover.
 * - ghost:       no chrome, for icon buttons in bars.
 * - link:        saffron-ink text link with an underline.
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-button font-sans font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-temple select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-200',
  {
    variants: {
      variant: {
        default:
          'bg-linear-to-b from-saffron-deep to-saffron-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),var(--shadow-cta)] hover:from-saffron-ink hover:[&>svg:last-child]:translate-x-[3px]',
        outline:
          'border border-ink/20 bg-transparent text-ink hover:border-ink/40 hover:bg-surface-alt',
        line: 'border border-current bg-transparent hover:border-saffron-deep hover:bg-saffron-deep hover:text-white',
        'ghost-light':
          'border border-white/55 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-night',
        ghost: 'text-ink hover:bg-surface-alt',
        link: 'h-auto min-h-11 px-0 text-saffron-ink underline decoration-gold-line underline-offset-4 hover:decoration-saffron-ink',
      },
      size: {
        default: 'h-12 px-6 text-[0.9375rem] [&_svg]:size-[1.125rem]',
        sm: 'h-11 px-5 text-small [&_svg]:size-4',
        lg: 'h-14 px-8 text-[1rem] [&_svg]:size-5',
        icon: 'size-11 pointer-coarse:size-[46px] [&_svg]:size-[1.375rem]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
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
