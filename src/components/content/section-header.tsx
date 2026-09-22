import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  /** Short uppercase label above the title. */
  eyebrow?: string
  description?: string
  action?: { href: string; label: string }
  /** Heading level; defaults to h2. */
  as?: 'h1' | 'h2' | 'h3'
  /** Pass to the section's aria-labelledby. */
  id?: string
  align?: 'start' | 'center'
  className?: string
}

/** Editorial section header: gold rule, eyebrow, title, optional description and "view all" link. */
export function SectionHeader({
  title,
  eyebrow,
  description,
  action,
  as: Heading = 'h2',
  id,
  align = 'start',
  className,
}: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        centered && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p
            className={cn(
              'flex items-center gap-3 text-label font-medium text-saffron-800 uppercase',
              centered && 'justify-center',
            )}
          >
            <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
            {eyebrow}
          </p>
        )}
        <Heading
          id={id}
          className={cn(
            'text-charcoal-900',
            eyebrow && 'mt-3',
            Heading === 'h1' ? 'text-h1' : Heading === 'h2' ? 'text-h2' : 'text-h3',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn('mt-3 measure text-charcoal-700', centered && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start font-medium text-saffron-800 sm:self-auto"
        >
          {action.label}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  )
}
