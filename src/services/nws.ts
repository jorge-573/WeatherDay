import type { UnitSystem } from '../config/units'

// Networking layer for the National Weather Service API. This module only does
// fetching and exposes raw response shapes; all raw-to-domain mapping lives in
// nwsMappers.ts.

const NWS_BASE = 'https://api.weather.gov'
const GEO_JSON = { Accept: 'application/geo+json' }

// NWS forecast endpoints accept us (Fahrenheit/mph) or si (Celsius/km/h).
function unitsParam(units: UnitSystem): 'us' | 'si' {
  return units === 'imperial' ? 'us' : 'si'
}

export type NwsValue = { value: number | null; unitCode?: string }

type NwsPointResponse = {
  properties?: {
    forecast?: string
    forecastHourly?: string
    observationStations?: string
    timeZone?: string
    astronomicalData?: {
      sunrise?: string
      sunset?: string
    }
  }
}

export type NwsForecastPeriod = {
  number: number
  startTime: string
  isDaytime: boolean
  temperature: number
  windSpeed?: string
  windDirection?: string
  icon: string
  shortForecast: string
}

type NwsForecastResponse = {
  properties?: { periods?: NwsForecastPeriod[] }
}

type NwsStationsResponse = {
  features?: { properties?: { stationIdentifier?: string } }[]
}

export type NwsObservation = {
  timestamp?: string
  textDescription?: string
  icon?: string | null
  temperature: NwsValue
  windSpeed: NwsValue
  windDirection: NwsValue
  relativeHumidity: NwsValue
  heatIndex: NwsValue
  windChill: NwsValue
}

type NwsObservationResponse = {
  properties?: NwsObservation
}

/** Resolved metadata for a point: the URLs and astronomical data we build on. */
export type NwsPoint = {
  forecastUrl: string
  forecastHourlyUrl: string
  stationsUrl: string
  timeZone?: string
  sunrise?: string
  sunset?: string
}

// Point metadata is stable per location and independent of the unit system, so
// cache it to avoid refetching when the user only toggles units.
const pointCache = new Map<string, NwsPoint | null>()

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  let res: Response
  try {
    res = await fetch(url, { signal, headers: GEO_JSON })
  } catch (err) {
    if (signal?.aborted) throw err
    return null
  }
  if (!res.ok) return null
  return (await res.json()) as T
}

/** Resolve a point to its forecast URLs. Returns null for non-US coords (NWS 404s). */
export async function fetchNwsPoint(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<NwsPoint | null> {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`
  const cached = pointCache.get(key)
  if (cached !== undefined) return cached

  const data = await getJson<NwsPointResponse>(`${NWS_BASE}/points/${key}`, signal)
  const props = data?.properties
  if (!props?.forecast || !props.forecastHourly || !props.observationStations) {
    pointCache.set(key, null)
    return null
  }

  const point: NwsPoint = {
    forecastUrl: props.forecast,
    forecastHourlyUrl: props.forecastHourly,
    stationsUrl: props.observationStations,
    timeZone: props.timeZone,
    sunrise: props.astronomicalData?.sunrise,
    sunset: props.astronomicalData?.sunset,
  }
  pointCache.set(key, point)
  return point
}

async function fetchPeriods(url: string, units: UnitSystem, signal?: AbortSignal): Promise<NwsForecastPeriod[]> {
  const withUnits = new URL(url)
  withUnits.searchParams.set('units', unitsParam(units))
  const data = await getJson<NwsForecastResponse>(withUnits.toString(), signal)
  return data?.properties?.periods ?? []
}

/** 12-hour day/night forecast periods (~7 days). */
export function fetchNwsForecast(url: string, units: UnitSystem, signal?: AbortSignal): Promise<NwsForecastPeriod[]> {
  return fetchPeriods(url, units, signal)
}

/** Hour-by-hour forecast periods. */
export function fetchNwsHourly(url: string, units: UnitSystem, signal?: AbortSignal): Promise<NwsForecastPeriod[]> {
  return fetchPeriods(url, units, signal)
}

/** Latest observation from the point's first reporting station, or null if unavailable. */
export async function fetchNwsLatestObservation(
  stationsUrl: string,
  signal?: AbortSignal
): Promise<NwsObservation | null> {
  const stations = await getJson<NwsStationsResponse>(stationsUrl, signal)
  const stationId = stations?.features?.[0]?.properties?.stationIdentifier
  if (!stationId) return null

  const observation = await getJson<NwsObservationResponse>(
    `${NWS_BASE}/stations/${stationId}/observations/latest`,
    signal
  )
  return observation?.properties ?? null
}
