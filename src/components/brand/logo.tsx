import { TempleIcon } from '@/components/icons'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/** The temple mark on its own, for error pages and image placeholders. */
export function LogoMark({ className }: { className?: string }) {
  return <TempleIcon className={cn('size-8 text-saffron', className)} />
}

/**
 * Temple mark + "OrangeTemple" wordmark + tagline (HOMEPAGE_SPEC.md §1). The mark is the
 * design's generic temple silhouette, not a depiction of a particular temple.
 * - onPhoto: over the hero (white text, light saffron accent)
 * - onCream: on the page background (ink text, saffron accent)
 * - onDark:  on the footer (cream text, light saffron accent)
 * The wordmark is decorative text: callers give the surrounding link an aria-label.
 */
export function Logo({
  tone = 'onCream',
  showTagline = true,
  className,
}: {
  tone?: 'onPhoto' | 'onCream' | 'onDark'
  showTagline?: boolean
  className?: string
}) {
  const accent = tone === 'onCream' ? 'text-saffron' : 'text-saffron-glow'
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <TempleIcon
        className={cn(
          'h-8 w-[29px] shrink-0 transition-colors duration-300 tablet:h-9 tablet:w-8',
          accent,
        )}
      />
      <span className="flex flex-col">
        <span className="font-serif text-[25px] leading-[0.9] font-semibold tracking-[0.2px] tablet:text-[27px]">
          <span className={cn('transition-colors duration-300', accent)}>Orange</span>
          <span
            className={cn(
              'transition-colors duration-300',
              tone === 'onCream'
                ? 'text-ink'
                : tone === 'onDark'
                  ? 'text-surface-alt'
                  : 'text-white',
            )}
          >
            Temple
          </span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-[5px] text-[7.5px] leading-none tracking-[1.6px] whitespace-nowrap uppercase tablet:text-[8.5px] tablet:tracking-[2.4px]',
              tone === 'onCream' ? 'text-muted-ink' : 'text-white/70',
            )}
          >
            {siteConfig.motto}
          </span>
        )}
      </span>
    </span>
  )
}
