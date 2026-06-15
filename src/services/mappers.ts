import { UNIT_CONFIG, type UnitSystem } from '../config/units'
import type {
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  WeatherStats,
} from '../types/weather'
import type { ForecastResponse } from './openMeteo'
import { getWeatherCondition } from './weatherCodes'

function formatLocation(city: GeocodingResult): string {
  const parts = [city.name]
  if (city.admin1) parts.push(city.admin1)
  if (city.countryCode) parts.push(city.countryCode)
  return parts.join(', ')
}

function formatHour(iso: string): string {
  const hour = isoHour(iso)
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

function formatClock(iso: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  if (!match) return ''
  let hour = Number(match[1])
  const minute = match[2]
  const meridiem = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${meridiem}`
}

function toPercent(value: number | null | undefined): number | null {
  return value === null || value === undefined ? null : Math.round(value)
}

function isoHour(iso: string): number {
  const match = /T(\d{2}):/.exec(iso)
  return match ? Number(match[1]) : new Date(iso).getHours()
}

function isoMinutes(iso: string): number {
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0
}

// daily.time is a date-only string (YYYY-MM-DD); parse as a local date so the
// weekday isn't shifted a day backward in negative UTC offsets.
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Today'
  return parseLocalDate(iso).toLocaleDateString('en-US', { weekday: 'short' })
}

function formatMonthDay(iso: string): string {
  const date = parseLocalDate(iso)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

function findCurrentHourIndex(times: string[], currentTime: string): number {
  const currentHour = currentTime.slice(0, 13)
  const exact = times.findIndex((t) => t.slice(0, 13) === currentHour)
  if (exact !== -1) return exact
  const next = times.findIndex((t) => t >= currentTime)
  return next === -1 ? 0 : next
}

export function toCurrentWeather(response: ForecastResponse, city: GeocodingResult): CurrentWeatherSnapshot {
  const code = response.current.weather_code
  const condition = getWeatherCondition(code)
  const sunByDate = new Map(
    response.daily.time.map((date, i) => [
      date,
      { sunrise: response.daily.sunrise[i], sunset: response.daily.sunset[i] },
    ])
  )
  return {
    location: formatLocation(city),
    temperature: Math.round(response.current.temperature_2m),
    condition: condition.label,
    code,
    isNight: isNightAt(response.current.time, sunByDate),
    group: condition.group,
    high: Math.round(response.daily.temperature_2m_max[0]),
    low: Math.round(response.daily.temperature_2m_min[0]),
    feelsLike: Math.round(response.current.apparent_temperature),
  }
}

function isNightAt(time: string, sunByDate: Map<string, { sunrise: string; sunset: string }>): boolean {
  const sun = sunByDate.get(time.slice(0, 10))
  if (!sun) {
    const hour = isoHour(time)
    return hour < 6 || hour >= 19
  }
  return time < sun.sunrise || time >= sun.sunset
}

export function toHourlyForecast(response: ForecastResponse): HourlyForecastEntry[] {
  const sunByDate = new Map(
    response.daily.time.map((date, i) => [
      date,
      { sunrise: response.daily.sunrise[i], sunset: response.daily.sunset[i] },
    ])
  )
  const startIdx = findCurrentHourIndex(response.hourly.time, response.current.time)
  return response.hourly.time.slice(startIdx, startIdx + 24).map((time, i) => {
    const idx = startIdx + i
    const isNow = i === 0
    const code = isNow ? response.current.weather_code : response.hourly.weather_code[idx]

    return {
      hour: isNow ? 'Now' : formatHour(time),
      temperature: Math.round(isNow ? response.current.temperature_2m : response.hourly.temperature_2m[idx]),
      code,
      condition: getWeatherCondition(code).label,
      isNight: isNightAt(time, sunByDate),
      isNow,
      precipitationProbability: toPercent(response.hourly.precipitation_probability?.[idx]),
    }
  })
}

export function toDailyForecast(response: ForecastResponse): DailyForecastEntry[] {
  return response.daily.time.map((time, i) => {
    const code = response.daily.weather_code[i]
    return {
      day: formatDayLabel(time, i),
      date: formatMonthDay(time),
      low: Math.round(response.daily.temperature_2m_min[i]),
      high: Math.round(response.daily.temperature_2m_max[i]),
      code,
      condition: getWeatherCondition(code).label,
      precipitationProbability: toPercent(response.daily.precipitation_probability_max?.[i]),
    }
  })
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

// Fraction of daylight elapsed (0-1) for the sunrise/sunset progress bar.
function dayProgress(current: string, sunrise: string, sunset: string): number {
  const now = isoMinutes(current)
  const start = isoMinutes(sunrise)
  const end = isoMinutes(sunset)
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (now - start) / (end - start)))
}

export function toWeatherStats(response: ForecastResponse, units: UnitSystem): WeatherStats {
  const config = UNIT_CONFIG[units]
  const { current, daily } = response
  return {
    sun: {
      sunrise: formatClock(daily.sunrise[0]),
      sunset: formatClock(daily.sunset[0]),
      progress: dayProgress(current.time, daily.sunrise[0], daily.sunset[0]),
    },
    wind: {
      value: Math.round(current.wind_speed_10m),
      unit: config.windLabel,
      direction: bearingToCompass(current.wind_direction_10m),
    },
    uv: {
      value: current.uv_index !== undefined ? Math.round(current.uv_index) : null,
      level: uvLevel(current.uv_index),
    },
  }
}
