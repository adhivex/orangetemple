'use server'

import { getSupabase } from '@/lib/supabase'
import { newsletterEmail, type NewsletterState } from '@/lib/newsletter'

/** Postgres unique_violation: the address is already on the list. */
const ALREADY_SUBSCRIBED = '23505'

/**
 * Footer newsletter sign-up (HOMEPAGE_SPEC.md §10–11, D-052). Validates with zod and
 * inserts through the publishable key, which may insert into `newsletter_subscribers` and
 * do nothing else. A repeat address reports success, so the form never reveals whether an
 * address was already stored.
 */
export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterEmail.safeParse(formData.get('email'))
  if (!parsed.success) return { status: 'invalid' }

  const { error } = await getSupabase()
    .from('newsletter_subscribers')
    .insert({ email: parsed.data, source: 'footer' })

  if (error && error.code !== ALREADY_SUBSCRIBED) {
    console.error('Newsletter sign-up failed:', error.message)
    return { status: 'error' }
  }
  return { status: 'success' }
}
