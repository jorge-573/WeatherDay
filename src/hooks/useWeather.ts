import { useEffect, useState } from 'react'
import type { UnitSystem } from '../config/units'
import { toCurrentWeather, toDailyForecast, toHourlyForecast, toWeatherStats } from '../services/mappers'
import { fetchForecast } from '../services/openMeteo'
import type {
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  WeatherStats,
} from '../types/weather'
import type { TimeOfDay } from '../types/timeOfDay'
import { getTimeOfDayFromLocalISO } from '../utils/getTimeOfDay'

export type WeatherData = {
  current: CurrentWeatherSnapshot
  hourly: HourlyForecastEntry[]
  daily: DailyForecastEntry[]
  stats: WeatherStats
  timeOfDay: TimeOfDay
}

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

    fetchForecast(city.latitude, city.longitude, units, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return
        const data: WeatherData = {
          current: toCurrentWeather(response, city),
          hourly: toHourlyForecast(response),
          daily: toDailyForecast(response),
          stats: toWeatherStats(response, units),
          timeOfDay: getTimeOfDayFromLocalISO(response.current.time),
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
