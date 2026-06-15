import { UNIT_CONFIG, type UnitSystem } from '../config/units'
import type { GeocodingResult } from '../types/weather'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

type RawGeocodingResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
  timezone?: string
}

type GeocodingResponse = {
  results?: RawGeocodingResult[]
}

export type ForecastResponse = {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    uv_index?: number
    visibility?: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
  }
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status}`)
  }

  const data = (await res.json()) as GeocodingResponse
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1,
    timezone: r.timezone,
  }))
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  units: UnitSystem,
  signal?: AbortSignal
): Promise<ForecastResponse> {
  const unitConfig = UNIT_CONFIG[units]
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'visibility',
    ].join(',')
  )
  url.searchParams.set('hourly', 'temperature_2m,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset')
  url.searchParams.set('temperature_unit', unitConfig.temperatureUnit)
  url.searchParams.set('wind_speed_unit', unitConfig.windSpeedUnit)
  url.searchParams.set('precipitation_unit', unitConfig.precipitationUnit)
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '10')

  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Forecast request failed: ${res.status}`)
  }

  return (await res.json()) as ForecastResponse
}

type UvResponse = { current?: { uv_index?: number } }

/** Minimal current UV-index lookup, used to supplement NWS (which has no UV). */
export async function fetchUvIndex(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<number | null> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set('current', 'uv_index')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`UV request failed: ${res.status}`)
  }

  const data = (await res.json()) as UvResponse
  return data.current?.uv_index ?? null
}
