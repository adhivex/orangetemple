import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/components/brand/logo'
import { env } from '@/env'
import { menuNav, primaryNav, siteConfig } from '@/lib/site-config'

/** Site footer: navigation, credits, contact and privacy (PRD §5.8). Dark surface. */
export function SiteFooter() {
  const year = new Date().getFullYear()
  const contactEmail = env.NEXT_PUBLIC_CONTACT_EMAIL

  return (
    <footer data-surface="dark" className="bg-charcoal-900 text-sand-100">
      <div className="container-wide grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link
            href="/"
            aria-label="OrangeTemple home"
            className="inline-flex min-h-11 items-center rounded-md"
          >
            <Logo tone="inverse" />
          </Link>
          <p className="mt-5 max-w-sm text-sand-100">{siteConfig.description}</p>
          <p className="mt-6 max-w-sm text-small text-sand-100/80">
            Timings and access rules change. Please confirm with the official source before you
            travel.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <h2 className="font-sans text-label font-medium text-saffron-500 uppercase">Explore</h2>
            <ul className="mt-4 space-y-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans text-label font-medium text-saffron-500 uppercase">
              OrangeTemple
            </h2>
            <ul className="mt-4 space-y-1">
              {menuNav.site.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-sans text-label font-medium text-saffron-500 uppercase">
              Corrections
            </h2>
            <p className="mt-4 text-small text-sand-100/80">
              Spotted something inaccurate? We review every correction.
            </p>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-2 inline-flex min-h-11 items-center text-ivory-50 underline decoration-saffron-500 underline-offset-4"
              >
                {contactEmail}
              </a>
            ) : (
              <FooterLink href="/contact">Contact us</FooterLink>
            )}
          </div>
        </nav>
      </div>

      <div className="border-t border-ivory-50/10">
        <div className="container-wide flex flex-col gap-2 py-6 text-small text-sand-100/70 md:flex-row md:justify-between">
          <p>© {year} OrangeTemple</p>
          <p>Photography is credited on each image and on the Credits page.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-sand-100 transition-colors hover:text-ivory-50"
    >
      {children}
    </Link>
  )
}
