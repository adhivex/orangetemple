import { TempleIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

/**
 * "Photo coming soon" card face (DESIGN_SYSTEM.md "Placeholder card", ASSETS.md): the
 * card frame with a deep saffron-to-brown field and a faint temple mark. Shown for every
 * temple without a licensed photograph; another temple's photo is never used instead.
 * Decorative: the card's name and state carry the meaning.
 */
export function TemplePlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid size-full place-items-center content-center gap-2.5 pb-[70px] text-[11px] tracking-[1.5px] text-gold-soft uppercase bg-photo-placeholder',
        className,
      )}
    >
      <TempleIcon className="h-[52px] w-[46px] text-saffron-glow opacity-55" />
      Photo coming soon
    </div>
  )
}
