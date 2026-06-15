import type { WeatherCondition } from '../services/weatherCodes'

export type WeatherGroup = WeatherCondition['group']

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

export type SunStat = {
  sunrise: string
  sunset: string
  progress: number
}

export type WeatherStats = {
  sun: SunStat
  wind: { value: number; unit: string; direction: string }
  uv: { value: number | null; level: string }
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
