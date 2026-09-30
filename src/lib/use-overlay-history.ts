'use client'

import { useEffect, useRef } from 'react'

/**
 * Lets the browser's Back (and Android's back gesture) close an overlay instead of
 * leaving the page (MOBILE_WEBAPP.md §4). Opening pushes a history entry; Back pops it
 * and calls `onClose`; closing any other way removes the entry again.
 *
 * Call the returned `release()` before navigating away from inside the overlay (for
 * example to a search result), so the entry is replaced by the navigation instead of
 * being popped after it.
 */
export function useOverlayHistory(open: boolean, onClose: () => void) {
  const pushed = useRef(false)
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    // Keep the router's own state on the entry, so its Back handling still works.
    window.history.pushState(window.history.state, '')
    pushed.current = true
    const onPop = () => {
      pushed.current = false
      close.current()
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (pushed.current) {
        pushed.current = false
        window.history.back()
      }
    }
  }, [open])

  return {
    release() {
      pushed.current = false
    },
  }
}
