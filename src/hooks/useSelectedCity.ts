import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_CITY } from '../config/defaultCity'
import type { GeocodingResult } from '../types/weather'

const CITY_STORAGE_KEY = 'weatherday:city'
const SOURCE_STORAGE_KEY = 'weatherday:city-source'

export type CitySource = 'search' | 'geolocation'

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

/** Persists city + how it was chosen (search vs GPS) across reloads. */
export function useSelectedCity() {
  const [city, setCity] = useState<GeocodingResult>(readStoredCity)
  const [source, setSource] = useState<CitySource | null>(readStoredSource)

  const selectCity = useCallback((next: GeocodingResult, nextSource: CitySource) => {
    setCity(next)
    setSource(nextSource)
  }, [])

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

  const isCurrentLocation = source === 'geolocation'

  return { city, source, isCurrentLocation, selectCity }
}
