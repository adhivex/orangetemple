import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { SiteAnalytics } from '@/components/analytics/site-analytics'
import { ConsentGate } from '@/components/consent/consent-gate'
import { CookieConsentProvider } from '@/components/consent/cookie-consent-provider'
import { MobileTabBar } from '@/components/layout/mobile-tab-bar'
import { ShellProvider } from '@/components/layout/shell-context'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { InstallPromptListener } from '@/components/pwa/install-prompt'
import { SearchProvider } from '@/components/search/search-provider'
import { Toaster } from '@/components/ui/sonner'
import { env } from '@/env'
import { cormorant, dmSans } from '@/lib/fonts'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { getSearchEntries } from '@/server/queries'

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
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Content may sit under the notch; safe-area padding handles it. Never set maximumScale
  // or userScalable: pinch-zoom must stay available.
  viewportFit: 'cover',
  // --ot-bg. Metadata needs a literal value, not a CSS variable. Cream theme only, even
  // when the device is in dark mode (D-046).
  themeColor: '#FBF1E5',
  colorScheme: 'only light',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const searchEntries = await getSearchEntries()
  return (
    <html lang="en-IN" className={cn(cormorant.variable, dmSans.variable)}>
      <body id="top" className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-button bg-ink px-4 py-3 text-surface focus:not-sr-only focus:fixed focus:top-[calc(env(safe-area-inset-top)+12px)] focus:left-3"
        >
          Skip to content
        </a>
        <CookieConsentProvider>
          <ShellProvider>
            <SearchProvider entries={searchEntries}>
              <SiteHeader />
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              {/* Phones: room for the floating tab bar (or the temple action bar). */}
              <div className="bg-night pb-20 tablet:pb-0">
                <SiteFooter />
              </div>
              <MobileTabBar />
            </SearchProvider>
          </ShellProvider>
          {/* Only on Vercel, which serves the analytics script (D-021), and only after the
              visitor allows analytics (D-051). */}
          {process.env.VERCEL && (
            <ConsentGate category="analytics">
              <SiteAnalytics />
            </ConsentGate>
          )}
        </CookieConsentProvider>
        <InstallPromptListener />
        <Toaster />
      </body>
    </html>
  )
}
