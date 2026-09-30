'use client'

import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import { homeCopy } from '@/content/home'
import {
  consentCookie,
  createConsent,
  readConsent,
  type Consent,
  type ConsentCategory,
} from '@/lib/consent'
import { notify } from '@/lib/notify'

import { CookieBanner } from './cookie-banner'

const copy = homeCopy.cookieConsent

// Radix Dialog loads only when the preferences are opened.
const CookiePreferencesDialog = dynamic(
  () => import('./cookie-preferences-dialog').then((m) => m.CookiePreferencesDialog),
  { ssr: false },
)

type ConsentContextValue = {
  /** The stored choice; null until read on the client or when none is stored. */
  consent: Consent | null
  save: (choice: Record<ConsentCategory, boolean>) => void
  openPreferences: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

/*
 * The consent cookie as an external store: every reader sees the same parsed value, and
 * a save notifies them. The snapshot is cached by the cookie's raw text so it stays
 * referentially stable between renders.
 */
const listeners = new Set<() => void>()
let cachedCookie: string | null = null
let cachedConsent: Consent | null = null

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  const cookie = document.cookie
  if (cookie !== cachedCookie) {
    cachedCookie = cookie
    const next = readConsent(cookie)
    // Keep the old object when the choice itself is unchanged.
    if (JSON.stringify(next) !== JSON.stringify(cachedConsent)) cachedConsent = next
  }
  return cachedConsent
}

const getServerSnapshot = () => null

export function useConsent() {
  const value = useContext(ConsentContext)
  if (!value) throw new Error('useConsent must be used inside <CookieConsentProvider>')
  return value
}

/**
 * Cookie consent (HOMEPAGE_SPEC.md "Cookie consent", D-051). Reads and writes the
 * `ot_consent` cookie, shows the first-visit banner 1.2s after load when no choice is
 * stored, and owns the preferences dialog. Nothing optional loads before a choice:
 * scripts wait behind <ConsentGate>.
 */
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [bannerVisible, setBannerVisible] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [prefsMounted, setPrefsMounted] = useState(false)

  // First visit: show the banner 1.2s after load, unless a choice is stored.
  useEffect(() => {
    if (readConsent(document.cookie)) return
    const timer = setTimeout(() => setBannerVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const save = useCallback((choice: Record<ConsentCategory, boolean>) => {
    const next = createConsent(choice)
    document.cookie = consentCookie(next, window.location.protocol === 'https:')
    listeners.forEach((listener) => listener())
    setBannerVisible(false)
    setPrefsOpen(false)
    notify(choice.analytics || choice.marketing ? copy.savedToast : copy.essentialOnlyToast)
  }, [])

  const openPreferences = useCallback(() => {
    setPrefsMounted(true)
    setPrefsOpen(true)
  }, [])

  const value = useMemo(
    () => ({ consent, save, openPreferences }),
    [consent, save, openPreferences],
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <CookieBanner visible={bannerVisible && !prefsOpen} />
      {prefsMounted && <CookiePreferencesDialog open={prefsOpen} onOpenChange={setPrefsOpen} />}
    </ConsentContext.Provider>
  )
}
