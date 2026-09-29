import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { SiteAnalytics } from '@/components/analytics/site-analytics'
import { BottomNav } from '@/components/layout/bottom-nav'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Toaster } from '@/components/ui/sonner'
import { env } from '@/env'
import { cormorant, dmSans } from '@/lib/fonts'
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={cn(cormorant.variable, dmSans.variable)}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-button bg-ink px-4 py-3 text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <div className="bg-ink pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          <SiteFooter />
        </div>
        <BottomNav />
        <Toaster />
        {/* Only on Vercel, which serves the analytics script (D-021). */}
        {process.env.VERCEL && <SiteAnalytics />}
      </body>
    </html>
  )
}
