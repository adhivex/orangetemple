import { cn } from '@/lib/utils'

/**
 * Geometric doorway-arch mark. Abstract by design: it does not depict any real
 * temple or deity. Placeholder brand mark pending owner approval.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn('size-8', className)}
    >
      <path
        d="M7.5 27.5V15.2C7.5 10.3 11.4 7.4 16 3.5C20.6 7.4 24.5 10.3 24.5 15.2V27.5"
        fill="none"
        className="stroke-saffron-700"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 27.5V19.4C12.25 17 13.9 15.5 16 13.9C18.1 15.5 19.75 17 19.75 19.4V27.5Z"
        className="fill-saffron-500"
      />
      <path
        d="M4.5 27.5H27.5"
        className="stroke-saffron-700"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Mark plus wordmark. `tone="inverse"` is for dark surfaces such as the footer. */
export function Logo({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: 'default' | 'inverse'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="size-7 shrink-0" />
      <span
        className={cn(
          'font-display text-[1.3125rem] leading-none font-medium tracking-[-0.01em]',
          tone === 'inverse' ? 'text-ivory-50' : 'text-charcoal-900',
        )}
      >
        Orange
        <span className={tone === 'inverse' ? 'text-saffron-500' : 'text-saffron-800'}>Temple</span>
      </span>
    </span>
  )
}
