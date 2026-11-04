import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UnitSystem } from '../config/units'
import { toAirQuality, toCurrentWeather, toDailyForecast, toHourlyForecast, toWeatherStats } from '../domain/mappers'
import { fetchAirQuality } from '../services/airQuality'
import { fetchAlerts } from '../services/nwsAlerts'
import { fetchForecast } from '../services/openMeteo'
import type { GeocodingResult, WeatherData } from '../types/weather'
import { getTimeOfDayFromLocalISO } from '../utils/getTimeOfDay'

const MINUTE_MS = 60_000
/** Open-Meteo updates current conditions every 15 minutes. */
const FORECAST_REFRESH_MS = 10 * MINUTE_MS
/** Warnings can be issued at any time, so alerts refresh more often than the forecast. */
const ALERTS_REFRESH_MS = 2 * MINUTE_MS
const AIR_QUALITY_REFRESH_MS = 30 * MINUTE_MS

type WeatherState = {
  data: WeatherData | null
  /** True until data for the current city and units has arrived; background refreshes don't count. */
  loading: boolean
  error: string | null
}

type ForecastData = Omit<WeatherData, 'alerts' | 'airQuality'>

async function loadForecast(city: GeocodingResult, units: UnitSystem, signal: AbortSignal): Promise<ForecastData> {
  const response = await fetchForecast(city.latitude, city.longitude, units, signal)
  return {
    units,
    current: toCurrentWeather(response, city),
    hourly: toHourlyForecast(response),
    daily: toDailyForecast(response),
    stats: toWeatherStats(response, units),
    timeOfDay: getTimeOfDayFromLocalISO(response.current.time),
  }
}

export function useWeather(city: GeocodingResult | null, units: UnitSystem): WeatherState {
  const enabled = city !== null
  const point = [city?.latitude, city?.longitude] as const

  const forecast = useQuery({
    queryKey: ['forecast', city?.id, ...point, units],
    queryFn: ({ signal }) => loadForecast(city!, units, signal),
    enabled,
    staleTime: FORECAST_REFRESH_MS / 2,
    refetchInterval: FORECAST_REFRESH_MS,
    // Keep showing the previous city or units while the next one loads.
    placeholderData: keepPreviousData,
  })
  // Alerts and air quality never fail the forecast: their services resolve to empty on error.
  const alerts = useQuery({
    queryKey: ['alerts', ...point],
    queryFn: ({ signal }) => fetchAlerts(city!.latitude, city!.longitude, signal),
    enabled,
    staleTime: ALERTS_REFRESH_MS / 2,
    refetchInterval: ALERTS_REFRESH_MS,
    placeholderData: keepPreviousData,
  })
  const airQuality = useQuery({
    queryKey: ['airQuality', ...point],
    queryFn: async ({ signal }) => toAirQuality(await fetchAirQuality(city!.latitude, city!.longitude, signal)),
    enabled,
    staleTime: AIR_QUALITY_REFRESH_MS / 2,
    refetchInterval: AIR_QUALITY_REFRESH_MS,
    placeholderData: keepPreviousData,
  })

  // Only combine results that all belong to the current city and units, so a new
  // city's forecast is never shown with the previous city's alerts.
  const isCurrent = !forecast.isPlaceholderData && !alerts.isPlaceholderData && !airQuality.isPlaceholderData
  const forecastData = isCurrent ? forecast.data : undefined
  const alertsData = isCurrent ? alerts.data : undefined
  const airQualityData = isCurrent ? airQuality.data : undefined
  const complete = useMemo<WeatherData | null>(
    () =>
      forecastData && alertsData && airQualityData !== undefined
        ? { ...forecastData, alerts: alertsData, airQuality: airQualityData }
        : null,
    [forecastData, alertsData, airQualityData]
  )

  // Keep the last complete snapshot on screen while the next city or units load.
  const [shown, setShown] = useState<WeatherData | null>(null)
  if (complete && complete !== shown) setShown(complete)

  if (!enabled) return { data: null, loading: false, error: null }

  return {
    data: complete ?? shown,
    loading: complete === null,
    error: forecast.error ? forecast.error.message : null,
  }
}
