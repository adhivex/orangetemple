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
 * Privacy notice. Describes the site as it works today: the consent cookie (D-051),
 * consent-gated Vercel Web Analytics (D-021, D-051) and the newsletter (D-052). Must be
 * reviewed by the owner before launch.
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
      <div className="container-narrow space-y-10 section-y text-ink-2">
        <section aria-labelledby="collect">
          <h2 id="collect" className="text-h2 text-ink">
            What we collect
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-gold">
            <li>There are no accounts, and we do not ask for your name.</li>
            <li>
              If you join the newsletter, we store your email address and the date you signed up,
              and nothing else.
            </li>
            <li>
              One essential cookie, <code>ot_consent</code>, remembers your cookie choices for a
              year.
            </li>
            <li>We do not use advertising or third-party tracking scripts.</li>
          </ul>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies" className="text-h2 text-ink">
            Cookies and your choices
          </h2>
          <p className="mt-4">
            On your first visit we ask whether we may use analytics and marketing cookies. Nothing
            optional loads until you choose, and rejecting is as easy as accepting. You can change
            your choice at any time from Cookie Settings in the footer. We do not use marketing
            cookies at present; the choice is there so that we can ask before we ever do.
          </p>
        </section>

        <section aria-labelledby="analytics">
          <h2 id="analytics" className="text-h2 text-ink">
            Visitor statistics
          </h2>
          <p className="mt-4">
            Only if you allow analytics: to learn which pages are useful, we count page views with
            Vercel Web Analytics, our hosting provider&rsquo;s cookieless analytics. It records the
            page viewed, the site that linked to it, and general information such as country,
            browser and device type. We remove search terms and filters from page addresses before
            they are counted. Vercel states that this analytics does not use cookies and does not
            follow visitors across websites.
          </p>
        </section>

        <section aria-labelledby="services">
          <h2 id="services" className="text-h2 text-ink">
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
          <h2 id="sharing" className="text-h2 text-ink">
            Sharing and directions
          </h2>
          <p className="mt-4">
            The Share button uses your device&rsquo;s own share sheet, or copies the link.
            Directions open your maps app. Nothing is sent to us.
          </p>
        </section>

        <section aria-labelledby="newsletter">
          <h2 id="newsletter" className="text-h2 text-ink">
            The newsletter
          </h2>
          <p className="mt-4">
            If you subscribe, we use your email address only to send occasional updates about new
            temples, stories and features. It is kept in our database, is never shown on the site
            and is not shared or sold. To be removed, email us from the{' '}
            <Link href="/contact" className="text-saffron-ink underline underline-offset-4">
              Contact
            </Link>{' '}
            page.
          </p>
        </section>

        <section aria-labelledby="email">
          <h2 id="email" className="text-h2 text-ink">
            If you email us
          </h2>
          <p className="mt-4">
            If you send a correction or a question, we use your email only to read and reply to it.
            See{' '}
            <Link href="/contact" className="text-saffron-ink underline underline-offset-4">
              Contact
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
