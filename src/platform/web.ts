import type { Coordinates, Platform } from './types'

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

function getCurrentPosition(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation is not supported in this browser'))
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (err) => reject(new Error(geolocationErrorMessage(err.code))),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 }
    )
  })
}

export const webPlatform: Platform = {
  storage: window.localStorage,
  geolocation: { getCurrentPosition },
}
