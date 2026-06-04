import { useEffect, useState } from 'react'

const STORAGE_KEY = 'weatherday:location-on-startup'

function readInitial(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === 'true'
}

export function useLocationOnStartup() {
  const [enabled, setEnabled] = useState(readInitial)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(enabled))
  }, [enabled])

  return { enabled, setEnabled }
}
