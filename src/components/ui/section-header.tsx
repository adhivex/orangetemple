import Link from 'next/link'
import type { ReactNode } from 'react'

import { ArrowRightIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

/**
 * Homepage section head (HOMEPAGE_SPEC.md §4–5, DESIGN_SYSTEM.md "Section emblem" and
 * "More link"): optional emblem, serif H2, muted subtitle and a "more" link that reads
 * "View All" on phones. Inner pages keep components/content/section-header.tsx.
 */
export function SectionHeader({
  id,
  icon,
  title,
  subtitle,
  moreHref,
  moreLabel,
  moreLabelMobile,
}: {
  /** The H2's id, for the section's aria-labelledby. */
  id: string
  icon?: ReactNode
  title: string
  subtitle?: string
  moreHref?: string
  moreLabel?: string
  moreLabelMobile?: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3.5 tablet:mb-[34px] tablet:items-end tablet:gap-[22px]">
      {icon && (
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center self-center rounded-full border border-gold-line bg-[radial-gradient(circle,var(--color-surface-alt),transparent_70%)] text-[28px] text-saffron tablet:size-16 tablet:text-[36px]"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1 tablet:flex-none">
        <h2
          id={id}
          className="font-serif text-[31px] leading-[1.02] font-medium tracking-[-0.3px] text-ink tablet:text-[clamp(32px,3.6vw,46px)]"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13.5px] text-muted-ink tablet:mt-2 tablet:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>
      {moreHref && moreLabel && (
        <Link
          href={moreHref}
          className={cn(
            'group ml-auto flex min-h-11 shrink-0 items-end gap-2.5 self-start border-b border-gold-line pb-1 text-[13px] font-medium whitespace-nowrap text-ink transition-colors hover:border-saffron-ink hover:text-saffron-ink',
            'tablet:min-h-0 tablet:self-end tablet:pb-1.5 tablet:text-[14px] pointer-coarse:tablet:min-h-11',
          )}
        >
          <span className="tablet:hidden">{moreLabelMobile ?? moreLabel}</span>
          <span className="hidden tablet:inline">{moreLabel}</span>
          <ArrowRightIcon
            aria-hidden="true"
            className="text-saffron transition-transform duration-300 ease-temple group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
