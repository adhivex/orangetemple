import { z } from 'zod'

/**
 * Newsletter email rule for the server action, the authority (D-052). Stored lowercased
 * and trimmed, matching the database check. Server-only: importing zod into the form
 * would ship all of it to every page, since the footer is everywhere.
 */
export const newsletterEmail = z.string().trim().toLowerCase().max(254).pipe(z.email())

export type NewsletterState = { status: 'idle' | 'success' | 'invalid' | 'error' }
