'use client'

import { useEffect } from 'react'

import './globals.css'

/**
 * Last-resort error boundary for failures in the root layout itself. It replaces the
 * whole document, so it cannot rely on the header, fonts or providers.
 */
export default function GlobalError({
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
    <html lang="en-IN">
      <body className="flex min-h-dvh items-center justify-center bg-surface p-6 text-ink">
        <title>Something went wrong · OrangeTemple</title>
        <main className="max-w-md text-center">
          <h1 className="font-serif text-h2">Something went wrong</h1>
          <p className="mt-4 text-ink-2">
            OrangeTemple could not load. This is usually temporary — please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 inline-flex h-12 items-center rounded-button bg-saffron-deep px-6 font-medium text-white hover:bg-saffron-ink"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
