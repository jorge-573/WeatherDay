import { reverseGeocode } from './reverseGeocode'
import { getPlatform } from '../platform'
import type { GeocodingResult } from '../types/weather'

/** Device GPS + reverse geocode; shared by the location button and startup preference. */
export async function fetchCurrentLocationCity(): Promise<GeocodingResult> {
  const { latitude, longitude } = await getPlatform().geolocation.getCurrentPosition()
  try {
    return await reverseGeocode(latitude, longitude)
  } catch {
    throw new Error('Could not resolve location name')
  }
}
