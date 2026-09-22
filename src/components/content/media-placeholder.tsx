import { LogoMark } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

/**
 * Neutral media fallback (DESIGN-SYSTEM.md §11 "missing images"). Decorative only:
 * the surrounding card or caption carries the meaning. Never rendered as temple
 * imagery, and never a stand-in in production for a real licensed photograph.
 */
export function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex size-full items-center justify-center bg-sand-100 bg-[radial-gradient(120%_80%_at_50%_0%,var(--ivory-50),transparent_70%)]',
        className,
      )}
    >
      <LogoMark className="size-12 opacity-20 grayscale" />
    </div>
  )
}
