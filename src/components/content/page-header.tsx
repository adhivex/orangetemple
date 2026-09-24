import type { ReactNode } from 'react'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/navigation/breadcrumbs'

/** Header for collection and site pages: breadcrumbs, eyebrow, h1 and a short lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string | null
  breadcrumbs?: BreadcrumbItem[]
  children?: ReactNode
}) {
  return (
    <header className="border-b border-border bg-sand-100/70">
      <div className="container-wide pt-6 pb-12 md:pt-8 md:pb-16">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <p className="mt-4 flex items-center gap-3 text-label font-medium text-saffron-800 uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-h1 text-charcoal-900">{title}</h1>
        {lede && <p className="mt-4 measure text-charcoal-700 md:text-[1.1875rem]">{lede}</p>}
        {children}
      </div>
    </header>
  )
}
