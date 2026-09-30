import { describe, expect, it } from 'vitest'

import { looksLikeEmail } from '@/lib/email'
import { newsletterEmail } from '@/lib/newsletter'

describe('newsletter email checks (D-052)', () => {
  it.each(['name@example.com', ' Pilgrim.Test@Example.co.in ', 'a+tag@sub.example.org'])(
    'accepts %s in the form and on the server',
    (email) => {
      expect(looksLikeEmail(email)).toBe(true)
      expect(newsletterEmail.safeParse(email).success).toBe(true)
    },
  )

  it.each(['', 'not-an-email', 'name@example', 'name @example.com', '@example.com'])(
    'rejects %j in the form',
    (email) => expect(looksLikeEmail(email)).toBe(false),
  )

  it('stores addresses trimmed and lowercased', () => {
    expect(newsletterEmail.parse('  Pilgrim.Test@Example.com ')).toBe('pilgrim.test@example.com')
  })
})
