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
import {
  compassFromDegrees,
  formatClock,
  formatDayLabel,
  formatHour,
  formatLocation,
  formatMonthDay,
  isoHour,
  isoMinutes,
  progressBetween,
  uvLevel,
} from './weatherFormat'

function findCurrentHourIndex(times: string[], currentTime: string): number {
  const currentHour = currentTime.slice(0, 13)
  const exact = times.findIndex((t) => t.slice(0, 13) === currentHour)
  if (exact !== -1) return exact
  const next = times.findIndex((t) => t >= currentTime)
  return next === -1 ? 0 : next
}

function isNightAt(time: string, sunByDate: Map<string, { sunrise: string; sunset: string }>): boolean {
  const sun = sunByDate.get(time.slice(0, 10))
  if (!sun) {
    const hour = isoHour(time)
    return hour < 6 || hour >= 19
  }
  return time < sun.sunrise || time >= sun.sunset
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
    }
  })
}

export function toWeatherStats(response: ForecastResponse, units: UnitSystem): WeatherStats {
  const config = UNIT_CONFIG[units]
  const { current, daily } = response
  return {
    sun: {
      sunrise: formatClock(daily.sunrise[0]),
      sunset: formatClock(daily.sunset[0]),
      progress: progressBetween(
        isoMinutes(current.time),
        isoMinutes(daily.sunrise[0]),
        isoMinutes(daily.sunset[0])
      ),
    },
    wind: {
      value: Math.round(current.wind_speed_10m),
      unit: config.windLabel,
      direction: compassFromDegrees(current.wind_direction_10m),
    },
    uv: {
      value: current.uv_index !== undefined ? Math.round(current.uv_index) : null,
      level: uvLevel(current.uv_index),
    },
  }
}
