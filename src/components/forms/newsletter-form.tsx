'use client'

import { useActionState, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { homeCopy } from '@/content/home'
import { newsletterEmail, type NewsletterState } from '@/lib/newsletter'
import { cn } from '@/lib/utils'
import { subscribeToNewsletter } from '@/server/newsletter'

const copy = homeCopy.newsletter

/**
 * Footer newsletter form (HOMEPAGE_SPEC.md §10–11): an email input and Subscribe inside
 * one pill, with the note beneath. Invalid addresses are caught before submitting; the
 * server action validates again and stores the address. No page reload; the note
 * announces the result.
 */
export function NewsletterForm() {
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(
    subscribeToNewsletter,
    { status: 'idle' },
  )
  const [clientInvalid, setClientInvalid] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') form.current?.reset()
    if (state.status === 'invalid') input.current?.focus()
  }, [state])

  const status = clientInvalid ? 'invalid' : state.status
  const note =
    status === 'success'
      ? copy.success
      : status === 'invalid'
        ? copy.invalid
        : status === 'error'
          ? copy.failed
          : copy.note

  return (
    <div className="min-w-0">
      <form
        ref={form}
        action={formAction}
        noValidate
        onSubmit={(event) => {
          const valid = newsletterEmail.safeParse(input.current?.value ?? '').success
          setClientInvalid(!valid)
          if (!valid) {
            event.preventDefault()
            input.current?.focus()
          }
        }}
        className="flex gap-1.5 rounded-button border border-gold-soft/25 bg-white/5 p-1.5 transition-colors focus-within:border-gold-soft"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          {copy.label}
        </label>
        <input
          ref={input}
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint="send"
          required
          placeholder={copy.placeholder}
          aria-invalid={status === 'invalid' || undefined}
          aria-describedby="newsletter-note"
          onChange={() => clientInvalid && setClientInvalid(false)}
          className="min-w-0 flex-1 rounded-button bg-transparent px-4 text-[16px] text-white outline-none placeholder:text-surface-alt/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-glow focus-visible:outline-solid tablet:px-[18px] tablet:text-[15px] pointer-coarse:text-[16px]"
        />
        <Button type="submit" disabled={pending} className="h-11 px-5 tablet:px-[26px]">
          {copy.cta}
        </Button>
      </form>
      <p
        id="newsletter-note"
        aria-live="polite"
        className={cn(
          'mt-3 text-[12.5px] tablet:ml-5',
          status === 'success'
            ? 'text-success-on-dark'
            : status === 'invalid' || status === 'error'
              ? 'text-error-on-dark'
              : 'text-surface-alt/60',
        )}
      >
        {note}
      </p>
    </div>
  )
}
