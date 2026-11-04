import type { Platform } from './types'

export type { Coordinates, GeolocationProvider, KeyValueStore, Platform } from './types'

let current: Platform | null = null

/** Must run once at startup, before anything reads storage or location. */
export function configurePlatform(platform: Platform): void {
  current = platform
}

export function getPlatform(): Platform {
  if (!current) {
    throw new Error('Platform not configured. Call configurePlatform() before rendering the app.')
  }
  return current
}
