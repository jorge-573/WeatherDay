import { useEffect, useState } from 'react'
import type { UnitSystem } from '../config/units'
import { fetchAlerts } from '../services/nwsAlerts'
import { fetchWeather } from '../services/weather'
import type { GeocodingResult, WeatherData } from '../types/weather'

export type { WeatherData } from '../types/weather'

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
      fetchWeather(city, units, controller.signal),
      fetchAlerts(city.latitude, city.longitude, controller.signal).catch(() => []),
    ])
      .then(([weather, alerts]) => {
        if (controller.signal.aborted) return
        setState({ data: { ...weather, alerts }, loading: false, error: null })
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
