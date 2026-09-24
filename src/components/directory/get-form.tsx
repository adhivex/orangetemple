'use client'

import type { ComponentProps, SubmitEvent } from 'react'

/**
 * A GET form that leaves empty fields out of the URL, so shared links stay clean
 * (/temples?deity=shiva rather than ?deity=shiva&state=&collection=). Pure progressive
 * enhancement: without JavaScript it submits like any form, and empty values are
 * ignored by the directory anyway.
 */
export function GetForm({ onSubmit, ...props }: Omit<ComponentProps<'form'>, 'method'>) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    for (const element of Array.from(event.currentTarget.elements)) {
      if (
        (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) &&
        element.name &&
        element.value.trim() === ''
      ) {
        element.disabled = true
        // Re-enable after the browser has serialised the form, in case navigation is slow.
        setTimeout(() => (element.disabled = false), 0)
      }
    }
    onSubmit?.(event)
  }
  return <form method="get" onSubmit={handleSubmit} {...props} />
}
