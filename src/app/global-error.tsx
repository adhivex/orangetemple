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
      <body className="flex min-h-dvh items-center justify-center bg-ivory-50 p-6 text-charcoal-900">
        <title>Something went wrong · OrangeTemple</title>
        <main className="max-w-md text-center">
          <h1 className="font-display text-h2">Something went wrong</h1>
          <p className="mt-4 text-charcoal-700">
            OrangeTemple could not load. This is usually temporary — please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 inline-flex h-12 items-center rounded-button bg-saffron-700 px-6 font-medium text-white hover:bg-saffron-800"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
