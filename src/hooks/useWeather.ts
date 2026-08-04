import { useEffect, useState } from 'react'
import type { UnitSystem } from '../config/units'
import { toAirQuality, toCurrentWeather, toDailyForecast, toHourlyForecast, toWeatherStats } from '../domain/mappers'
import { fetchAirQuality } from '../services/airQuality'
import { fetchAlerts } from '../services/nwsAlerts'
import { fetchForecast } from '../services/openMeteo'
import type { GeocodingResult, WeatherData } from '../types/weather'
import { getTimeOfDayFromLocalISO } from '../utils/getTimeOfDay'

type WeatherState = {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

export function useWeather(city: GeocodingResult | null, units: UnitSystem): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: city !== null,
    error: null,
  })

  useEffect(() => {
    if (!city) {
      setState({ data: null, loading: false, error: null })
      return
    }

    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    Promise.all([
      fetchForecast(city.latitude, city.longitude, units, controller.signal),
      fetchAlerts(city.latitude, city.longitude, controller.signal).catch(() => []),
      fetchAirQuality(city.latitude, city.longitude, controller.signal).catch(() => null),
    ])
      .then(([response, alerts, airQuality]) => {
        if (controller.signal.aborted) return
        const data: WeatherData = {
          current: toCurrentWeather(response, city),
          hourly: toHourlyForecast(response),
          daily: toDailyForecast(response),
          stats: toWeatherStats(response, units),
          timeOfDay: getTimeOfDayFromLocalISO(response.current.time),
          alerts,
          airQuality: toAirQuality(airQuality),
        }
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Could not load weather'
        setState((prev) => ({ data: prev.data, loading: false, error: message }))
      })

    return () => controller.abort()
  }, [city, units])

  return state
}
