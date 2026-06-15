import { useOutletContext } from 'react-router-dom'
import type { UnitSystem } from '../../config/units'
import type { useCityLocation } from '../../hooks/useCityLocation'
import type { WeatherData } from '../../hooks/useWeather'

export type LayoutContext = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  units: UnitSystem
  cityLocation: ReturnType<typeof useCityLocation>
  onUnitChange: (units: UnitSystem) => void
}

export function useLayoutContext() {
  return useOutletContext<LayoutContext>()
}
