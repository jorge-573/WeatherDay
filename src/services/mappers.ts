import type {
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  NarrativeEntry,
  WeatherStat,
} from '../types/weather'
import type { ForecastResponse } from './openMeteo'
import { getWeatherCondition } from './weatherCodes'

export function formatLocation(city: GeocodingResult): string {
  const parts = [city.name]
  if (city.admin1) parts.push(city.admin1)
  if (city.countryCode) parts.push(city.countryCode)
  return parts.join(', ')
}

function formatHour(iso: string): string {
  const date = new Date(iso)
  const hour = date.getHours()
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

function formatDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Today'
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function findCurrentHourIndex(times: string[], currentTime: string): number {
  const idx = times.findIndex((t) => t >= currentTime)
  return idx === -1 ? 0 : idx
}

export function toCurrentWeather(response: ForecastResponse, city: GeocodingResult): CurrentWeatherSnapshot {
  const condition = getWeatherCondition(response.current.weather_code)
  return {
    location: formatLocation(city),
    temperature: Math.round(response.current.temperature_2m),
    condition: condition.label,
    high: Math.round(response.daily.temperature_2m_max[0]),
    low: Math.round(response.daily.temperature_2m_min[0]),
    feelsLike: Math.round(response.current.apparent_temperature),
  }
}

export function toHourlyForecast(response: ForecastResponse): HourlyForecastEntry[] {
  const startIdx = findCurrentHourIndex(response.hourly.time, response.current.time)
  return response.hourly.time.slice(startIdx, startIdx + 6).map((time, i) => {
    const idx = startIdx + i
    const isNow = i === 0
    return {
      hour: isNow ? 'Now' : formatHour(time),
      temperature: Math.round(response.hourly.temperature_2m[idx]),
      isNow,
    }
  })
}

export function toDailyForecast(response: ForecastResponse): DailyForecastEntry[] {
  return response.daily.time.map((time, i) => ({
    day: formatDayLabel(time, i),
    low: Math.round(response.daily.temperature_2m_min[i]),
    high: Math.round(response.daily.temperature_2m_max[i]),
  }))
}

const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

function bearingToCompass(bearing: number): string {
  const idx = Math.round((bearing % 360) / 45) % 8
  return directions[idx]
}

function uvLevel(uv: number | undefined): string {
  if (uv === undefined) return 'No data'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

function visibilityNote(metres: number | undefined): string {
  if (metres === undefined) return 'No data'
  const miles = metres / 1609.34
  if (miles >= 6) return 'Clear view'
  if (miles >= 3) return 'Hazy'
  return 'Reduced'
}

export function toWeatherStats(response: ForecastResponse): WeatherStat[] {
  const { current } = response
  const visibilityMiles = current.visibility !== undefined ? Math.round(current.visibility / 1609.34) : null
  return [
    {
      label: 'UV Index',
      value: current.uv_index !== undefined ? Math.round(current.uv_index).toString() : '—',
      note: uvLevel(current.uv_index),
    },
    {
      label: 'Wind',
      value: `${Math.round(current.wind_speed_10m)} mph`,
      note: `${bearingToCompass(current.wind_direction_10m)} direction`,
    },
    {
      label: 'Humidity',
      value: `${Math.round(current.relative_humidity_2m)}%`,
      note: 'Relative humidity',
    },
    {
      label: 'Visibility',
      value: visibilityMiles !== null ? `${visibilityMiles} mi` : '—',
      note: visibilityNote(current.visibility),
    },
  ]
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function toNarrative(response: ForecastResponse, city: GeocodingResult): NarrativeEntry[] {
  const todayHigh = Math.round(response.daily.temperature_2m_max[0])
  const todayLow = Math.round(response.daily.temperature_2m_min[0])
  const tomorrowHigh = Math.round(response.daily.temperature_2m_max[1] ?? todayHigh)
  const tomorrowLow = Math.round(response.daily.temperature_2m_min[1] ?? todayLow)
  const condition = getWeatherCondition(response.current.weather_code).label.toLowerCase()
  const tomorrowCondition = getWeatherCondition(response.daily.weather_code[1] ?? 0).label.toLowerCase()

  return [
    {
      period: 'Today',
      body: `${capitalize(condition)} in ${city.name} with a high near ${todayHigh} and a low around ${todayLow}.`,
    },
    {
      period: 'Tonight',
      body: `Lows near ${todayLow} with conditions remaining ${condition}.`,
    },
    {
      period: 'Tomorrow',
      body: `Expect ${tomorrowCondition} with temperatures between ${tomorrowLow} and ${tomorrowHigh}.`,
    },
  ]
}
