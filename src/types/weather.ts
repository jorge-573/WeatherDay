export type CurrentWeatherSnapshot = {
  location: string
  temperature: number
  condition: string
  high: number
  low: number
  feelsLike: number
}

export type HourlyForecastEntry = {
  hour: string
  temperature: number
  isNow?: boolean
}

export type DailyForecastEntry = {
  day: string
  low: number
  high: number
}

export type WeatherStat = {
  label: string
  value: string
  note: string
}

export type NarrativeEntry = {
  period: string
  body: string
}
