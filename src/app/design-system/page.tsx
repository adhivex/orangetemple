import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ArrowRight, Check, SlidersHorizontal } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { LogoMark } from '@/components/brand/logo'
import { EditorialCard } from '@/components/content/editorial-card'
import { MediaPlaceholder } from '@/components/content/media-placeholder'
import { NativeName } from '@/components/content/native-name'
import { Rail } from '@/components/content/rail'
import { SectionHeader } from '@/components/content/section-header'
import { ActionBar } from '@/components/layout/action-bar'
import { MenuSheet } from '@/components/layout/menu-sheet'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { approvedPairings, contrastRatio, parseColorTokens } from '@/lib/contrast'

/*
 * INTERNAL component preview for the Phase 1 review gate (DEVELOPMENT-PLAN.md).
 * Not indexed, never linked in production, and deleted before Phase 11.
 */
export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
}

const palette: { token: string; role: string }[] = [
  { token: 'ivory-50', role: 'Page background' },
  { token: 'sand-100', role: 'Sections, cards, dividers' },
  { token: 'charcoal-900', role: 'Primary text; text on saffron' },
  { token: 'charcoal-700', role: 'Secondary text' },
  { token: 'stone-600', role: 'Meta text' },
  { token: 'saffron-500', role: 'Brand fill — charcoal text only' },
  { token: 'saffron-700', role: 'Primary button fill' },
  { token: 'saffron-800', role: 'Links and small text' },
  { token: 'gold-500', role: 'Decorative accents only' },
]

const typeScale = [
  { name: 'Display', className: 'text-display font-display', spec: '40/44 → 72/76' },
  { name: 'H1', className: 'text-h1 font-display', spec: '32/38 → 52/58' },
  { name: 'H2', className: 'text-h2 font-display', spec: '26/32 → 38/44' },
  { name: 'H3', className: 'text-h3 font-display', spec: '20/28 → 26/34' },
  { name: 'Body', className: 'text-body', spec: '17/27 → 18/29' },
  { name: 'Small / meta', className: 'text-small text-stone-600', spec: '14/20' },
  { name: 'Label', className: 'text-label uppercase font-medium', spec: '13, tracked' },
]

/*
 * Sample cards use only values documented in docs/SEED-DATA.md (names, places, states,
 * collections). Native names are the unverified candidates listed there.
 */
const sampleTemples = [
  {
    slug: 'somnath',
    name: 'Somnath Temple',
    native: 'सोमनाथ',
    place: 'Prabhas Patan, Gujarat',
    label: 'Jyotirlinga',
    note: 'One of the twelve Jyotirlingas.',
  },
  {
    slug: 'kedarnath',
    name: 'Kedarnath Temple',
    native: 'केदारनाथ',
    place: 'Rudraprayag, Uttarakhand',
    label: 'Jyotirlinga',
    note: 'One of the twelve Jyotirlingas.',
  },
  {
    slug: 'rameshwaram',
    name: 'Rameshwaram',
    native: 'रामेश्वरम',
    place: 'Rameswaram, Tamil Nadu',
    label: 'Jyotirlinga · Char Dham',
    note: 'A member of both the twelve Jyotirlingas and the four dhams.',
  },
  {
    slug: 'badrinath',
    name: 'Badrinath Temple',
    native: 'बद्रीनाथ',
    place: 'Chamoli, Uttarakhand',
    label: 'Char Dham',
    note: 'One of the four dhams.',
  },
]

const sections = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['buttons', 'Buttons'],
  ['headers', 'Section headers'],
  ['cards', 'Cards'],
  ['sheets', 'Sheets'],
  ['action-bar', 'Action bar'],
  ['motion', 'Motion'],
  ['states', 'States'],
] as const

export default function DesignSystemPage() {
  if (process.env.VERCEL_ENV === 'production') notFound()

  const tokens = parseColorTokens(readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8'))

  return (
    <>
      <header className="border-b border-border bg-sand-100/60">
        <div className="container-standard py-12 md:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/15 bg-ivory-50 px-3 py-1 text-small text-charcoal-700">
            <span aria-hidden="true" className="size-2 rounded-full bg-saffron-500" />
            Internal · not indexed · removed before production
          </p>
          <h1 className="mt-6 text-h1 text-charcoal-900">Design system</h1>
          <p className="mt-4 measure text-charcoal-700">
            Phase 1 review. Every component here is the production component, rendered with sample
            props. Check it at 360, 390, 430, 768, 1024 and 1440 px, and try it with a keyboard.
          </p>
          <nav
            aria-label="Sections"
            className="-mx-(--gutter) mt-8 scrollbar-none overflow-x-auto px-(--gutter)"
          >
            <ul className="flex w-max gap-2">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex h-11 items-center rounded-full border border-charcoal-900/15 bg-ivory-50 px-4 text-small font-medium text-charcoal-900 hover:border-charcoal-900/35"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <DemoSection
        id="colour"
        title="Colour"
        description="Tokens from DESIGN-SYSTEM.md §2, read live from globals.css."
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map(({ token, role }) => (
            <li key={token}>
              <div
                className="aspect-[3/2] rounded-card border border-border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <p className="mt-2 font-mono text-small text-charcoal-900">--{token}</p>
              <p className="font-mono text-small text-stone-600 uppercase">{tokens[token]}</p>
              <p className="mt-1 text-small text-charcoal-700">{role}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-h3">Approved pairings</h3>
        <p className="mt-2 measure text-charcoal-700">
          Every text pairing the system allows, with its measured ratio. A unit test fails the build
          if any of these drops below its threshold.
        </p>
        <div className="mt-6 overflow-x-auto rounded-card border border-border">
          <table className="w-full min-w-[34rem] text-left text-small">
            <thead className="bg-sand-100 text-charcoal-700">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Sample
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Use
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Pairing
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Ratio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {approvedPairings.map(({ fg, bg, min, use }) => {
                const ratio = contrastRatio(tokens[fg]!, tokens[bg]!)
                return (
                  <tr key={`${fg}-${bg}-${use}`}>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex h-9 w-14 items-center justify-center rounded-md font-display text-[1.125rem]"
                        style={{ color: `var(--${fg})`, backgroundColor: `var(--${bg})` }}
                      >
                        Aa
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal-900">{use}</td>
                    <td className="px-4 py-3 font-mono text-stone-600">
                      {fg} / {bg}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-medium text-charcoal-900 tabular-nums">
                        {ratio.toFixed(2)}:1
                      </span>
                      <span className="ml-2 inline-flex items-center gap-1 text-stone-600">
                        <Check className="size-3.5 text-saffron-800" aria-hidden="true" />≥ {min}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DemoSection>

      <DemoSection
        id="type"
        title="Typography"
        description="Fraunces for display and headings, Inter for body and UI. Sizes scale fluidly between the mobile (360 px) and desktop (1280 px) values."
      >
        <dl className="divide-y divide-border border-y border-border">
          {typeScale.map(({ name, className, spec }) => (
            <div
              key={name}
              className="grid gap-2 py-6 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-8"
            >
              <dt className="text-small text-stone-600">
                <span className="font-medium text-charcoal-900">{name}</span>
                <span className="block font-mono">{spec}</span>
              </dt>
              <dd className={className}>Sacred temples of Bharat</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-h3">Reading measure</h3>
            <div className="mt-4 measure space-y-4 text-charcoal-700">
              <p>
                Long-form sections sit in the narrow container at about sixty-five characters per
                line, so history, legends and visiting notes stay comfortable to read on a phone and
                on a wide monitor alike.
              </p>
              <p>
                Body text never drops below sixteen pixels. Links use the deeper saffron —{' '}
                <a href="#type" className="text-saffron-800 underline underline-offset-4">
                  like this one
                </a>{' '}
                — which keeps them above 4.5:1 on ivory.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-h3">Native script</h3>
            <p className="mt-2 text-small text-stone-600">
              Candidate names from SEED-DATA.md §2, pending verification. Marked{' '}
              <code className="font-mono">lang=&quot;hi&quot;</code>; the Devanagari fonts load only
              on pages that render them.
            </p>
            <ul className="mt-5 space-y-3">
              {sampleTemples.map((t) => (
                <li
                  key={t.slug}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-3"
                >
                  <span className="font-display text-h3">{t.name}</span>
                  <NativeName variant="serif" className="text-h3 text-charcoal-700">
                    {t.native}
                  </NativeName>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        id="buttons"
        title="Buttons"
        description="Every size meets the 44 × 44 px touch target. Tab through them to check the focus ring."
      >
        <div className="space-y-8">
          <Row label="Variants">
            <Button>Plan your visit</Button>
            <Button variant="accent">Explore Bharat</Button>
            <Button variant="secondary">View all temples</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small · 44</Button>
            <Button>Default · 48</Button>
            <Button size="lg">
              Large · 56 <ArrowRight aria-hidden="true" />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Filters">
              <SlidersHorizontal aria-hidden="true" />
            </Button>
          </Row>
          <div data-surface="dark" className="rounded-card bg-charcoal-900 p-6">
            <p className="text-label font-medium text-saffron-500 uppercase">Dark surface</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="inverse">Inverse outline</Button>
            </div>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        id="headers"
        title="Section headers"
        description="Gold rule and eyebrow, a Fraunces title, optional description and a view-all link."
      >
        <div className="space-y-12 rounded-card bg-sand-100/60 p-6 md:p-10">
          <SectionHeader
            eyebrow="Collection"
            title="The 12 Jyotirlingas"
            description="Twelve shrines of Shiva, from Somnath in Gujarat to Kedarnath in Uttarakhand."
            action={{ href: '/jyotirlingas', label: 'View collection' }}
          />
          <SectionHeader
            align="center"
            eyebrow="Centred"
            title="Explore by region"
            description="Used for quieter, standalone sections."
          />
        </div>
      </DemoSection>

      <DemoSection
        id="cards"
        title="Cards"
        description="The whole card is one link. On mobile the rail swipes with the next card peeking, at 4:5; from 768 px it becomes a 3:2 grid."
      >
        <Rail label="Sample temples" columns={4}>
          {sampleTemples.map((t) => (
            <EditorialCard
              key={t.slug}
              href={`/temples/${t.slug}`}
              title={t.name}
              label={t.label}
              location={t.place}
              description={t.note}
              media={<MediaPlaceholder />}
            >
              <NativeName className="mt-0.5 text-small text-stone-600">{t.native}</NativeName>
            </EditorialCard>
          ))}
        </Rail>
        <p className="mt-6 text-small text-stone-600">
          Images are neutral placeholders: no licensed photography exists yet (open item 5).
        </p>
      </DemoSection>

      <DemoSection
        id="sheets"
        title="Sheets"
        description="Built on Radix Dialog: focus is trapped, Escape closes, focus returns to the trigger."
      >
        <Row label="Triggers">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <SlidersHorizontal aria-hidden="true" />
                Bottom sheet
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" closeLabel="Close filters">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Layout sample. Real filter controls arrive in Phase 3.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <fieldset>
                  <legend className="text-label font-medium text-stone-600 uppercase">
                    Region
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['North', 'South', 'East', 'West', 'Central'].map((region) => (
                      <button
                        key={region}
                        type="button"
                        className="inline-flex h-11 items-center rounded-full border border-charcoal-900/20 px-4 text-small font-medium text-charcoal-900 hover:bg-sand-100"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </SheetBody>
              <SheetFooter>
                <Button variant="secondary" className="flex-1">
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">Show results</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Side panel</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Side panel</SheetTitle>
                <SheetDescription>
                  For larger screens, where a bottom sheet would feel awkward.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p className="text-charcoal-700">Panel content.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>

          <span className="inline-flex items-center gap-2 text-small text-stone-600">
            Menu sheet <MenuSheet />
          </span>
        </Row>
      </DemoSection>

      <DemoSection
        id="action-bar"
        title="Action bar"
        description="Replaces the bottom tab bar on temple pages, on mobile. Shown inline here; on a temple page it is fixed above the safe area."
      >
        <div className="grid max-w-3xl gap-8 md:grid-cols-2">
          <figure>
            <ActionBar placement="inline" title="Sample" latitude={0} longitude={0} />
            <figcaption className="mt-2 text-small text-stone-600">
              With coordinates. Sample point (0, 0), not a temple location.
            </figcaption>
          </figure>
          <figure>
            <ActionBar placement="inline" title="Sample" />
            <figcaption className="mt-2 text-small text-stone-600">
              No verified coordinates: Directions is hidden.
            </figcaption>
          </figure>
        </div>
      </DemoSection>

      <DemoSection
        id="motion"
        title="Motion"
        description="Sections fade and rise as they enter the viewport, driven by the CSS scroll timeline (D-035): no JavaScript, visible by default, and nothing moves with reduced motion on. Interactions add small motions of their own: sheets slide, card images lift on hover, navigation underlines grow (200–400 ms)."
      >
        <ul className="grid gap-3 text-charcoal-700 sm:grid-cols-3">
          {[
            ['Sheets', 'Slide up and fade: 300 ms in, 200 ms out.'],
            ['Cards', 'Image scales to 103% on hover, 500 ms ease-out.'],
            ['Navigation', 'Active underline grows from the left, 300 ms.'],
          ].map(([name, detail]) => (
            <li key={name} className="rounded-card border border-border p-5">
              <p className="font-display text-h3 text-charcoal-900">{name}</p>
              <p className="mt-2 text-small">{detail}</p>
            </li>
          ))}
        </ul>
      </DemoSection>

      <DemoSection
        id="states"
        title="States"
        description="Neutral fallback for missing images, and the branded 404 and error pages."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {(['aspect-[4/5]', 'aspect-[3/2]', 'aspect-video'] as const).map((aspect, i) => (
            <figure key={aspect}>
              <div className={`${aspect} overflow-hidden rounded-card`}>
                <MediaPlaceholder />
              </div>
              <figcaption className="mt-2 text-small text-stone-600">
                {['Card, mobile 4:5', 'Card and gallery 3:2', 'Hero, desktop 16:9'][i]}
              </figcaption>
            </figure>
          ))}
        </div>
        <Row label="Pages" className="mt-8">
          <Button asChild variant="secondary">
            <Link href="/temples/this-temple-does-not-exist">Open the 404 page</Link>
          </Button>
        </Row>
        <div className="mt-12 flex items-center gap-3 text-small text-stone-600">
          <LogoMark className="size-6" /> Brand mark: placeholder, pending owner approval.
        </div>
      </DemoSection>
    </>
  )
}

function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-b border-border">
      <div className="container-standard section-y">
        <SectionHeader
          id={`${id}-title`}
          title={title}
          description={description}
          className="mb-10"
        />
        {children}
      </div>
    </section>
  )
}

function Row({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-label font-medium text-stone-600 uppercase">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
