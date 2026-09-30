'use client'

import { useEffect, useSyncExternalStore } from 'react'

/*
 * Install-to-home-screen state (MOBILE_WEBAPP.md §1). Chrome fires `beforeinstallprompt`
 * once, early, long before anyone opens the menu, so a listener mounted in the root
 * layout keeps the event here for the install card to use later.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState = { prompt: BeforeInstallPromptEvent | null; installed: boolean }

let state: InstallState = { prompt: null, installed: false }
const listeners = new Set<() => void>()

function setState(next: Partial<InstallState>) {
  state = { ...state, ...next }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const serverState: InstallState = { prompt: null, installed: false }

export function useInstallPrompt() {
  const current = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  )
  return {
    ...current,
    async install() {
      const event = current.prompt
      if (!event) return 'unavailable' as const
      await event.prompt()
      const { outcome } = await event.userChoice
      setState({ prompt: null, installed: outcome === 'accepted' })
      return outcome
    },
  }
}

/** Mounted once in the root layout. Renders nothing. */
export function InstallPromptListener() {
  useEffect(() => {
    const onPrompt = (event: Event) => {
      // Keep the browser's own mini-infobar away: the only unprompted first-visit overlay
      // is the cookie banner. The menu's install card offers installation instead.
      event.preventDefault()
      setState({ prompt: event as BeforeInstallPromptEvent })
    }
    const onInstalled = () => setState({ prompt: null, installed: true })
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  return null
}
