'use client'

import { useSyncExternalStore } from 'react'

const getIsMac = () => {
  if (typeof window === 'undefined') return false
  const platform =
    (navigator as any)?.userAgentData?.platform || navigator?.platform || ''
  return platform.toUpperCase().indexOf('MAC') >= 0
}

// Simple store for OS detection that doesn't change during the session
const osStore = {
  subscribe: () => () => {}, // No need to subscribe as OS doesn't change
  getSnapshot: getIsMac,
  getServerSnapshot: () => false,
}

export function useOsShortcut() {
  const isMac = useSyncExternalStore(
    osStore.subscribe,
    osStore.getSnapshot,
    osStore.getServerSnapshot
  )

  return {
    modKey: isMac ? '⌘' : 'Ctrl',
    altKey: isMac ? '⌥' : 'Alt',
    shiftKey: isMac ? '⇧' : 'Shift',
    isMac,
  }
}
