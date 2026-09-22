import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'

/**
 * Holding homepage for Phases 0–3. Replaced by the database-driven homepage in Phase 4.
 */
export default function HomePage() {
  const showPreviewLink = process.env.VERCEL_ENV !== 'production'

  return (
    <section className="container-standard section-y">
      <p className="flex items-center gap-3 text-label font-medium text-saffron-800 uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
        {siteConfig.name}
      </p>
      <h1 className="mt-5 max-w-4xl text-display text-charcoal-900">
        The sacred temples and spiritual heritage of Bharat
      </h1>
      <p className="mt-6 measure text-charcoal-700">{siteConfig.description}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/jyotirlingas">
            The 12 Jyotirlingas
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/char-dham">The Char Dham</Link>
        </Button>
      </div>
      {showPreviewLink && (
        <p className="mt-16 border-t border-border pt-6 text-small text-stone-600">
          In development.{' '}
          <Link href="/design-system" className="text-saffron-800 underline underline-offset-4">
            Review the design system
          </Link>
        </p>
      )}
    </section>
  )
}
