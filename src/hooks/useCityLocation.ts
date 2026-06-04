import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_CITY } from '../config/defaultCity'
import { fetchCurrentLocationCity } from '../services/currentLocation'
import type { GeocodingResult } from '../types/weather'

const CITY_STORAGE_KEY = 'weatherday:city'
const SOURCE_STORAGE_KEY = 'weatherday:city-source'
const STARTUP_STORAGE_KEY = 'weatherday:location-on-startup'

type CitySource = 'search' | 'geolocation'

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (!value || typeof value !== 'object') return false
  const c = value as GeocodingResult
  return (
    typeof c.id === 'number' &&
    typeof c.name === 'string' &&
    typeof c.latitude === 'number' &&
    typeof c.longitude === 'number'
  )
}

function readStoredCity(): GeocodingResult {
  if (typeof window === 'undefined') return DEFAULT_CITY
  try {
    const raw = window.localStorage.getItem(CITY_STORAGE_KEY)
    if (!raw) return DEFAULT_CITY
    const parsed: unknown = JSON.parse(raw)
    if (isGeocodingResult(parsed)) return parsed
  } catch {
    // ignore corrupt storage
  }
  return DEFAULT_CITY
}

function readStoredSource(): CitySource | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SOURCE_STORAGE_KEY)
  return raw === 'search' || raw === 'geolocation' ? raw : null
}

function readStartupEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STARTUP_STORAGE_KEY) === 'true'
}

/** City selection, GPS, persistence, and startup preference in one place. */
export function useCityLocation() {
  const [city, setCity] = useState<GeocodingResult>(readStoredCity)
  const [source, setSource] = useState<CitySource | null>(readStoredSource)
  const [locationOnStartup, setLocationOnStartup] = useState(readStartupEnabled)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)

  const selectCity = useCallback((next: GeocodingResult, nextSource: CitySource) => {
    setCity(next)
    setSource(nextSource)
  }, [])

  const selectFromSearch = useCallback(
    (next: GeocodingResult) => {
      selectCity(next, 'search')
    },
    [selectCity]
  )

  const requestCurrentLocation = useCallback(() => {
    setLocating(true)
    setLocateError(null)

    fetchCurrentLocationCity()
      .then((resolved) => {
        selectCity(resolved, 'geolocation')
        setLocateError(null)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not get your location'
        setLocateError(message)
      })
      .finally(() => setLocating(false))
  }, [selectCity])

  useEffect(() => {
    window.localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city))
  }, [city])

  useEffect(() => {
    if (source) {
      window.localStorage.setItem(SOURCE_STORAGE_KEY, source)
    } else {
      window.localStorage.removeItem(SOURCE_STORAGE_KEY)
    }
  }, [source])

  useEffect(() => {
    window.localStorage.setItem(STARTUP_STORAGE_KEY, String(locationOnStartup))
  }, [locationOnStartup])

  useEffect(() => {
    if (!locationOnStartup) return

    let cancelled = false
    fetchCurrentLocationCity()
      .then((resolved) => {
        if (!cancelled) selectCity(resolved, 'geolocation')
      })
      .catch(() => {
        // Keep last saved city if GPS or reverse geocode fails on startup.
      })

    return () => {
      cancelled = true
    }
  }, [locationOnStartup, selectCity])

  return {
    city,
    isCurrentLocation: source === 'geolocation',
    selectFromSearch,
    requestCurrentLocation,
    locating,
    locateError,
    locationOnStartup,
    setLocationOnStartup,
  }
}
