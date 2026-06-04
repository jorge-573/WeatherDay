import { useCallback, useState } from 'react'
import { fetchCurrentLocationCity } from '../services/currentLocation'
import type { GeocodingResult } from '../types/weather'

type CurrentLocationState = {
  loading: boolean
  error: string | null
  requestLocation: () => void
}

export function useCurrentLocation(onSuccess: (city: GeocodingResult) => void): CurrentLocationState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    setLoading(true)
    setError(null)

    fetchCurrentLocationCity()
      .then((city) => {
        onSuccess(city)
        setError(null)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not get your location'
        setError(message)
      })
      .finally(() => setLoading(false))
  }, [onSuccess])

  return { loading, error, requestLocation }
}
