import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { BottomNav } from '@/components/layout/bottom-nav'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { MotionProvider } from '@/components/motion/motion-provider'
import { env } from '@/env'
import { fraunces, inter } from '@/lib/fonts'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  // --saffron-700 (DESIGN-SYSTEM.md §13). Metadata needs a literal value, not a CSS variable.
  themeColor: '#BF510C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={cn(fraunces.variable, inter.variable)}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-button bg-charcoal-900 px-4 py-3 text-ivory-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <div className="bg-charcoal-900 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
            <SiteFooter />
          </div>
          <BottomNav />
        </MotionProvider>
      </body>
    </html>
  )
}
