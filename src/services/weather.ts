import type { UnitSystem } from '../config/units'
import type { GeocodingResult, WeatherData } from '../types/weather'
import { getTimeOfDayFromLocalISO } from '../utils/getTimeOfDay'
import { toCurrentWeather, toDailyForecast, toHourlyForecast, toWeatherStats } from './mappers'
import {
  fetchNwsForecast,
  fetchNwsHourly,
  fetchNwsLatestObservation,
  fetchNwsPoint,
  type NwsPoint,
} from './nws'
import { toCurrentFromNws, toDailyFromNws, toHourlyFromNws, toStatsFromNws } from './nwsMappers'
import { fetchForecast, fetchUvIndex } from './openMeteo'

// Everything in WeatherData except alerts, which the hook fetches separately.
export type WeatherSnapshot = Omit<WeatherData, 'alerts'>

/**
 * Resolve weather for a location, preferring NWS (US-only) and falling back to
 * Open-Meteo for non-US locations or when NWS returns no usable data.
 */
export async function fetchWeather(
  city: GeocodingResult,
  units: UnitSystem,
  signal?: AbortSignal
): Promise<WeatherSnapshot> {
  const point = await fetchNwsPoint(city.latitude, city.longitude, signal).catch(() => null)
  if (point) {
    const snapshot = await fromNws(point, city, units, signal)
    if (snapshot) return snapshot
  }

  const response = await fetchForecast(city.latitude, city.longitude, units, signal)
  return fromOpenMeteo(response, city, units)
}

async function fromNws(
  point: NwsPoint,
  city: GeocodingResult,
  units: UnitSystem,
  signal?: AbortSignal
): Promise<WeatherSnapshot | null> {
  const [forecast, hourly, observation, uv] = await Promise.all([
    fetchNwsForecast(point.forecastUrl, units, signal),
    fetchNwsHourly(point.forecastHourlyUrl, units, signal),
    fetchNwsLatestObservation(point.stationsUrl, signal).catch(() => null),
    fetchUvIndex(city.latitude, city.longitude, signal).catch(() => null),
  ])

  // No forecast data to build on: let the caller fall back to Open-Meteo.
  if (forecast.length === 0 && hourly.length === 0) return null

  const daily = toDailyFromNws(forecast, hourly)
  return {
    current: toCurrentFromNws(observation, hourly, daily, city, units),
    hourly: toHourlyFromNws(hourly),
    daily,
    stats: toStatsFromNws(observation, forecast[0], point.sunrise, point.sunset, uv, units),
    timeOfDay: getTimeOfDayFromLocalISO(hourly[0]?.startTime ?? new Date().toISOString()),
  }
}

function fromOpenMeteo(
  response: Awaited<ReturnType<typeof fetchForecast>>,
  city: GeocodingResult,
  units: UnitSystem
): WeatherSnapshot {
  return {
    current: toCurrentWeather(response, city),
    hourly: toHourlyForecast(response),
    daily: toDailyForecast(response),
    stats: toWeatherStats(response, units),
    timeOfDay: getTimeOfDayFromLocalISO(response.current.time),
  }
}
