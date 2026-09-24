import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/content/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description: 'How OrangeTemple handles your information.',
  path: '/privacy',
})

/*
 * Privacy notice. Describes the site as it works today; must be reviewed by the owner
 * (and updated in Phase 11 when Vercel Web Analytics is added, D-021) before launch.
 */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Privacy' }])} />
      <PageHeader
        eyebrow="Privacy"
        title="Privacy"
        lede="OrangeTemple is built to collect as little about you as possible."
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Privacy' }]}
      />
      <div className="container-narrow space-y-10 section-y text-charcoal-700">
        <section aria-labelledby="collect">
          <h2 id="collect" className="text-h2 text-charcoal-900">
            What we collect
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-gold-500">
            <li>There are no accounts, and we do not ask for your name or contact details.</li>
            <li>OrangeTemple does not set cookies.</li>
            <li>We do not use advertising or third-party tracking scripts.</li>
          </ul>
        </section>

        <section aria-labelledby="services">
          <h2 id="services" className="text-h2 text-charcoal-900">
            Services that help run the site
          </h2>
          <p className="mt-4">
            Like any website, OrangeTemple is delivered by a hosting provider that processes
            technical information about each request, such as your IP address and browser type, to
            serve the page and keep the service secure. Temple photographs may be delivered by an
            image service, and maps by a mapping service; your browser contacts those services
            directly when it loads an image or a map.
          </p>
        </section>

        <section aria-labelledby="sharing">
          <h2 id="sharing" className="text-h2 text-charcoal-900">
            Sharing and directions
          </h2>
          <p className="mt-4">
            The Share button uses your device&rsquo;s own share sheet, or copies the link.
            Directions open your maps app. Nothing is sent to us.
          </p>
        </section>

        <section aria-labelledby="email">
          <h2 id="email" className="text-h2 text-charcoal-900">
            If you email us
          </h2>
          <p className="mt-4">
            If you send a correction or a question, we use your email only to read and reply to it.
            See{' '}
            <Link href="/contact" className="text-saffron-800 underline underline-offset-4">
              Contact
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
