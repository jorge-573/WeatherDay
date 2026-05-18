import { useEffect, useState } from 'react'
import { toCurrentWeather, toDailyForecast, toHourlyForecast, toNarrative, toWeatherStats } from '../services/mappers'
import { fetchForecast } from '../services/openMeteo'
import type {
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  NarrativeEntry,
  WeatherStat,
} from '../types/weather'

export type WeatherData = {
  current: CurrentWeatherSnapshot
  hourly: HourlyForecastEntry[]
  daily: DailyForecastEntry[]
  stats: WeatherStat[]
  narrative: NarrativeEntry[]
}

type WeatherState = {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

export function useWeather(city: GeocodingResult | null): WeatherState {
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

    fetchForecast(city.latitude, city.longitude, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return
        const data: WeatherData = {
          current: toCurrentWeather(response, city),
          hourly: toHourlyForecast(response),
          daily: toDailyForecast(response),
          stats: toWeatherStats(response),
          narrative: toNarrative(response, city),
        }
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Could not load weather'
        setState((prev) => ({ data: prev.data, loading: false, error: message }))
      })

    return () => controller.abort()
  }, [city])

  return state
}
