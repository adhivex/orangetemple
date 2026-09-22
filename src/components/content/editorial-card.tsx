import { MapPin } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EditorialCardProps = {
  href: string
  title: string
  /** Collection or deity label, shown above the title. */
  label?: string
  /** Location line, e.g. "Varanasi, Uttar Pradesh". */
  location?: string
  description?: string
  /** The image (or MediaPlaceholder). */
  media: ReactNode
  /** `responsive`: 4:5 in the mobile carousel, 3:2 in the desktop grid (DESIGN-SYSTEM.md §3a). */
  aspect?: 'responsive' | '4/5' | '3/2'
  /** Extra content under the title, e.g. a native-script name. */
  children?: ReactNode
  className?: string
}

/**
 * Editorial card (DESIGN-SYSTEM.md §7). The whole card is one link: the title link's
 * ::after covers the card, so screen readers hear only the concise title while the
 * entire surface stays clickable. Focus ring is drawn around the whole card.
 */
export function EditorialCard({
  href,
  title,
  label,
  location,
  description,
  media,
  aspect = 'responsive',
  children,
  className,
}: EditorialCardProps) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-card outline-offset-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-card bg-sand-100 shadow-card',
          aspect === 'responsive' && 'aspect-[4/5] md:aspect-[3/2]',
          aspect === '4/5' && 'aspect-[4/5]',
          aspect === '3/2' && 'aspect-[3/2]',
        )}
      >
        <div className="size-full transition-transform duration-500 ease-out-soft motion-safe:group-hover:scale-[1.03]">
          {media}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        {label && <p className="text-label font-medium text-stone-600 uppercase">{label}</p>}
        <h3 className={cn('text-h3 text-charcoal-900', label && 'mt-1.5')}>
          <Link
            href={href}
            className="decoration-saffron-500 decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        {children}
        {location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-small text-stone-600">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {location}
          </p>
        )}
        {description && <p className="mt-2 line-clamp-2 text-charcoal-700">{description}</p>}
      </div>
    </article>
  )
}
