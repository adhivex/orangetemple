'use client'

import { RotateCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { LogoMark } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'

/**
 * Branded error page with retry (DESIGN-SYSTEM.md §11). `retry()` re-fetches and
 * re-renders the segment — the right recovery for a transient database error.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="container-narrow section-y text-center">
      <LogoMark className="mx-auto size-14" />
      <h1 className="mt-8 text-h1 text-charcoal-900">Something went wrong</h1>
      <p className="mx-auto mt-4 measure text-charcoal-700">
        We could not load this page just now. This is usually temporary — please try again.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" onClick={() => retry()}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Go to the homepage</Link>
        </Button>
      </div>
      {error.digest && <p className="mt-8 text-small text-stone-600">Reference: {error.digest}</p>}
    </section>
  )
}
