import { z } from 'zod'

/**
 * Newsletter email rule, shared by the form (instant feedback) and the server action
 * (the authority). Stored lowercased and trimmed, matching the database check (D-052).
 */
export const newsletterEmail = z.string().trim().toLowerCase().max(254).pipe(z.email())

export type NewsletterState = { status: 'idle' | 'success' | 'invalid' | 'error' }
