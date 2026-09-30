import { cacheLife } from 'next/cache'
import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { ArrowUpIcon } from '@/components/icons'
import { NavItem } from '@/components/navigation/nav-item'
import { homeCopy } from '@/content/home'
import { siteConfig } from '@/lib/site-config'

const copy = homeCopy.footer

/** Copyright year. Cached for a day: Cache Components forbids a bare `new Date()` in a prerender. */
async function currentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

const linkClass =
  'inline-block py-2.5 text-left text-[15px] text-surface-alt/72 transition-colors hover:text-white tablet:py-0 tablet:text-[14.5px] pointer-coarse:py-[9px]'

/**
 * Site footer on `night` (HOMEPAGE_SPEC.md §10–11): the newsletter row, a brand column
 * and three link columns, and a bottom bar with the OrangeKite credit, which stays on
 * every page. Social buttons are left out until real profile URLs exist (D-053).
 * Phone: brand full width, Explore and Discover side by side, OrangeTemple full width in
 * two columns. Tablet portrait: brand row, then three columns. Desktop: four columns.
 */
export async function SiteFooter() {
  const year = await currentYear()

  return (
    <footer data-surface="dark" className="bg-night text-surface-alt">
      <div className="container-site">
        <section
          aria-labelledby="newsletter-title"
          className="grid gap-[22px] border-b border-gold-soft/14 pt-11 pb-9 text-center tablet:grid-cols-2 tablet:items-center tablet:gap-7 tablet:pt-14 tablet:pb-12 tablet:text-left desktop:gap-12"
        >
          <div>
            <h2
              id="newsletter-title"
              className="font-serif text-[30px] leading-[1.05] font-medium desktop:text-[clamp(30px,3vw,40px)]"
            >
              {homeCopy.newsletter.title}
            </h2>
            <p className="mt-2 text-[15px] text-surface-alt/60">{homeCopy.newsletter.subtitle}</p>
          </div>
          <NewsletterForm />
        </section>

        <div className="grid grid-cols-2 gap-x-5 gap-y-[34px] pt-10 pb-9 tablet:grid-cols-3 tablet:gap-x-7 tablet:gap-y-10 tablet:pt-14 tablet:pb-[52px] desktop:grid-cols-[1.5fr_1fr_1fr_1fr] desktop:gap-12">
          <div className="col-span-full desktop:col-span-1">
            <Link
              href="/"
              aria-label="OrangeTemple home"
              className="inline-flex min-h-11 items-center rounded-md"
            >
              <Logo tone="onDark" />
            </Link>
            <p className="mt-4 max-w-[22em] text-[14px] leading-[1.7] text-surface-alt/60 tablet:mt-5">
              {copy.description}
            </p>
          </div>

          {copy.columns.map((column, index) => {
            // The last column (OrangeTemple) spans the phone width, its links in two columns.
            const last = index === copy.columns.length - 1
            return (
              <nav
                key={column.title}
                aria-labelledby={`footer-${column.title.toLowerCase()}`}
                className={last ? 'col-span-full tablet:col-span-1' : undefined}
              >
                <h2
                  id={`footer-${column.title.toLowerCase()}`}
                  className="mt-1 mb-2 font-sans text-[11px] font-semibold tracking-[2.6px] text-gold-soft uppercase tablet:mb-[18px]"
                >
                  {column.title}
                </h2>
                <ul
                  className={
                    last
                      ? 'grid grid-cols-2 gap-x-5 tablet:grid-cols-1 tablet:gap-[11px] pointer-coarse:tablet:gap-0.5'
                      : 'grid tablet:gap-[11px] pointer-coarse:tablet:gap-0.5'
                  }
                >
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <NavItem item={link} className={linkClass} />
                    </li>
                  ))}
                </ul>
              </nav>
            )
          })}
        </div>
      </div>

      <div className="border-t border-gold-soft/14 pt-5 pb-[calc(env(safe-area-inset-bottom)+22px)] tablet:pt-[22px] tablet:pb-[26px]">
        <div className="container-site flex flex-col items-start gap-3 text-[13px] text-surface-alt/60 tablet:flex-row tablet:flex-wrap tablet:items-center tablet:justify-between tablet:gap-4">
          <p className="flex flex-col gap-1.5 tablet:flex-row tablet:gap-0">
            <span>
              © {year} {siteConfig.name}.in
            </span>
            <span aria-hidden="true" className="hidden px-2.5 opacity-50 tablet:inline">
              |
            </span>
            <span>{copy.dedication}</span>
          </p>
          <div className="flex w-full items-center justify-between gap-[18px] tablet:w-auto">
            <p>
              {copy.credit.prefix}{' '}
              <a
                href={copy.credit.href}
                target="_blank"
                rel="noopener"
                className="inline-block border-b border-gold-line pt-2.5 pb-px font-medium text-surface-alt transition-colors hover:border-saffron-glow hover:text-saffron-glow tablet:pt-0 pointer-coarse:pt-2.5"
              >
                {copy.credit.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <a
              href="#top"
              aria-label={copy.backToTop}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-soft/22 text-[15px] text-surface-alt transition-colors hover:border-saffron-deep hover:bg-saffron-deep tablet:size-[38px] pointer-coarse:size-11"
            >
              <ArrowUpIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
