import type { TimeOfDay } from './timeOfDay'

export type WeatherGroup = 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog'

export type WeatherIntensity = 'light' | 'normal' | 'heavy'

/** One WMO weather code resolved into something presentable. */
export type WeatherCondition = {
  label: string
  group: WeatherGroup
  // Only meaningful for precipitation (rain/snow); drives intensity-aware icons.
  intensity?: WeatherIntensity
}

export type CurrentWeatherSnapshot = {
  location: string
  temperature: number
  condition: string
  code: number
  isNight: boolean
  group: WeatherGroup
  high: number
  low: number
  feelsLike: number
}

export type HourlyForecastEntry = {
  hour: string
  temperature: number
  code: number
  condition: string
  isNight: boolean
  isNow?: boolean
  precipitationProbability: number | null
}

export type DailyForecastEntry = {
  day: string
  date: string
  low: number
  high: number
  code: number
  condition: string
  precipitationProbability: number | null
}

export type SunPhase = 'beforeSunrise' | 'daylight' | 'afterSunset'

export type SunStat = {
  sunrise: string
  sunset: string
  /** 0-1 across daylight only; meaningless outside the `daylight` phase. */
  progress: number
  phase: SunPhase
  /** Until the next sun event, pre-formatted as e.g. "6h 12m". Null when unavailable. */
  until: string | null
  /** Length of day, pre-formatted as e.g. "13h 42m". */
  daylight: string | null
  /** Hours of direct sun, pre-formatted the same way. */
  sunshine: string | null
}

export type PressureTrend = 'rising' | 'falling' | 'steady'

export type AqiCategory = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous'

export type AirQuality = {
  aqi: number
  category: AqiCategory
  label: string
  pm25: number | null
}

/**
 * Secondary metrics for the stats grid. Values that need fixed decimal places
 * are pre-formatted as strings; null means the provider had no data.
 */
export type WeatherStats = {
  sun: SunStat
  wind: { value: number; unit: string; direction: string; gusts: number | null }
  uv: { value: number | null; level: string }
  humidity: { value: number | null; dewPoint: number | null }
  precipitation: { total: string | null; unit: string; hours: number | null }
  pressure: { value: string | null; unit: string; trend: PressureTrend }
  visibility: { value: string | null; unit: string }
}

export type GeocodingResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  countryCode?: string
  admin1?: string
  timezone?: string
}

/** Everything one location's forecast contributes to the UI. */
export type WeatherData = {
  current: CurrentWeatherSnapshot
  hourly: HourlyForecastEntry[]
  daily: DailyForecastEntry[]
  stats: WeatherStats
  timeOfDay: TimeOfDay
  alerts: WeatherAlert[]
  /** Null when the air-quality provider had no data for this point. */
  airQuality: AirQuality | null
}

export type AlertSeverity = 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown'

export type WeatherAlert = {
  id: string
  event: string
  headline?: string
  description?: string
  instruction?: string
  severity: AlertSeverity
  areaDesc?: string
  onset?: string
  effective?: string
  expires?: string
  ends?: string
  senderName?: string
}
