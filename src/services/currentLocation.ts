import { reverseGeocode } from './reverseGeocode'
import type { GeocodingResult } from '../types/weather'

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location permission denied'
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Location unavailable'
    case GeolocationPositionError.TIMEOUT:
      return 'Location request timed out'
    default:
      return 'Could not get your location'
  }
}

/** Browser GPS + reverse geocode; shared by the location button and startup preference. */
export function fetchCurrentLocationCity(): Promise<GeocodingResult> {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported in this browser'))
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await reverseGeocode(position.coords.latitude, position.coords.longitude)
          resolve(city)
        } catch {
          reject(new Error('Could not resolve location name'))
        }
      },
      (err) => reject(new Error(geolocationErrorMessage(err.code))),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 }
    )
  })
}
