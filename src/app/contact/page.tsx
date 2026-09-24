import { Mail } from 'lucide-react'
import type { Metadata } from 'next'

import { PageHeader } from '@/components/content/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { Button } from '@/components/ui/button'
import { env } from '@/env'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Contact and corrections',
  description: 'Send a correction or get in touch with OrangeTemple.',
  path: '/contact',
})

/**
 * Corrections and contact (ARCHITECTURE.md §12): a mailto link only, so there is no
 * public write endpoint. The address is required on production deploys (src/env.ts).
 */
export default function ContactPage() {
  const email = env.NEXT_PUBLIC_CONTACT_EMAIL
  const subject = encodeURIComponent('Correction for OrangeTemple')

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact' }])} />
      <PageHeader
        eyebrow="Contact"
        title="Contact and corrections"
        lede="Spotted something inaccurate or out of date? We review every correction."
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Contact' }]}
      />
      <div className="container-narrow space-y-10 section-y text-charcoal-700">
        <section aria-labelledby="send">
          <h2 id="send" className="text-h2 text-charcoal-900">
            Send a correction
          </h2>
          <p className="mt-4">It helps us most if you include:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-gold-500">
            <li>the temple and the page it appears on,</li>
            <li>what is wrong or missing, and</li>
            <li>a source we can check, such as the temple&rsquo;s official website.</li>
          </ul>
          {email ? (
            <div className="mt-8">
              <Button asChild size="lg">
                <a href={`mailto:${email}?subject=${subject}`}>
                  <Mail aria-hidden="true" />
                  Email {email}
                </a>
              </Button>
            </div>
          ) : (
            <p className="mt-8 rounded-card border border-dashed border-charcoal-900/30 p-5 text-small">
              Development notice: set <code className="font-mono">NEXT_PUBLIC_CONTACT_EMAIL</code>{' '}
              to show the corrections address. Production deploys refuse to build without it.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
