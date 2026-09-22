import type { Metadata } from 'next'
import Link from 'next/link'

import { LogoMark } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { menuNav } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

/** Branded 404 with ways back in (DESIGN-SYSTEM.md §11). Returns a real 404 status. */
export default function NotFound() {
  return (
    <section className="container-narrow section-y text-center">
      <LogoMark className="mx-auto size-14" />
      <p className="mt-8 text-label font-medium text-saffron-800 uppercase">Error 404</p>
      <h1 className="mt-3 text-h1 text-charcoal-900">This path leads nowhere</h1>
      <p className="mx-auto mt-4 measure text-charcoal-700">
        The page you were looking for has moved or does not exist. Try the temple directory, or
        begin with one of our collections.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/temples">Browse all temples</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Go to the homepage</Link>
        </Button>
      </div>
      <ul className="mt-10 flex flex-wrap justify-center gap-x-6">
        {menuNav.collections.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center text-saffron-800 underline underline-offset-4"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
