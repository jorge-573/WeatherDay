import type { WeatherCondition } from '../services/weatherCodes'

export type WeatherGroup = WeatherCondition['group']

export type CurrentWeatherSnapshot = {
  location: string
  temperature: number
  condition: string
  group: WeatherGroup
  high: number
  low: number
  feelsLike: number
}

export type HourlyForecastEntry = {
  hour: string
  temperature: number
  code: number
  isNight: boolean
  isNow?: boolean
}

export type DailyForecastEntry = {
  day: string
  date: string
  low: number
  high: number
  code: number
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
