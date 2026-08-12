import { UNIT_CONFIG, type UnitSystem } from '../config/units'
import type {
  AirQuality,
  AqiCategory,
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  PressureTrend,
  SunPhase,
  SunStat,
  UvLevel,
  WeatherStats,
} from '../types/weather'
import type { AirQualityResponse, ForecastResponse } from '../types/openMeteo'
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

function isMissing(value: number | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

function roundOrNull(value: number | null | undefined): number | null {
  return isMissing(value) ? null : Math.round(value)
}

/** Seconds to a compact "13h 42m" label. */
function formatDuration(seconds: number | null | undefined): string | null {
  if (isMissing(seconds)) return null
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`
}

function isoHour(iso: string): number {
  const match = /T(\d{2}):/.exec(iso)
  return match ? Number(match[1]) : new Date(iso).getHours()
}

/** Minutes since local midnight, or null when the timestamp is absent or malformed. */
function isoMinutesOrNull(iso: string | null | undefined): number | null {
  if (!iso) return null
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

function isoMinutes(iso: string): number {
  return isoMinutesOrNull(iso) ?? 0
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
      precipitationProbability: roundOrNull(response.hourly.precipitation_probability?.[idx]),
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
      precipitationProbability: roundOrNull(response.daily.precipitation_probability_max?.[i]),
    }
  })
}

const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

function bearingToCompass(bearing: number): string {
  const idx = Math.round((bearing % 360) / 45) % 8
  return directions[idx]
}

function uvLevel(uv: number | undefined): UvLevel {
  if (uv === undefined) return 'No data'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

// Fraction of daylight elapsed (0-1) for the sun arc's filled sweep. Clamped, so
// this is only meaningful during the `daylight` phase; callers must check the
// phase before drawing anything positional with it.
function dayProgress(current: string, sunrise: string, sunset: string): number {
  const now = isoMinutes(current)
  const start = isoMinutes(sunrise)
  const end = isoMinutes(sunset)
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (now - start) / (end - start)))
}

const MINUTES_PER_DAY = 24 * 60

function sunPhase(nowMinutes: number, sunriseMinutes: number, sunsetMinutes: number): SunPhase {
  if (nowMinutes < sunriseMinutes) return 'beforeSunrise'
  if (nowMinutes >= sunsetMinutes) return 'afterSunset'
  return 'daylight'
}

/**
 * Minutes until the sun next rises or sets. After sunset this counts forward to
 * tomorrow's sunrise, which is why the forecast needs more than one day.
 */
function minutesUntilNextSunEvent(
  phase: SunPhase,
  nowMinutes: number,
  sunriseMinutes: number,
  sunsetMinutes: number,
  tomorrowSunriseMinutes: number | null
): number | null {
  switch (phase) {
    case 'beforeSunrise':
      return sunriseMinutes - nowMinutes
    case 'daylight':
      return sunsetMinutes - nowMinutes
    case 'afterSunset':
      return tomorrowSunriseMinutes === null ? null : MINUTES_PER_DAY - nowMinutes + tomorrowSunriseMinutes
  }
}

function toSunStat(response: ForecastResponse): SunStat {
  const { current, daily } = response
  const sunriseIso = daily.sunrise[0]
  const sunsetIso = daily.sunset[0]
  const durations = {
    daylight: formatDuration(daily.daylight_duration?.[0]),
    sunshine: formatDuration(daily.sunshine_duration?.[0]),
  }

  const nowMinutes = isoMinutesOrNull(current.time)
  const sunriseMinutes = isoMinutesOrNull(sunriseIso)
  const sunsetMinutes = isoMinutesOrNull(sunsetIso)
  // During polar day the provider reports the sunset on the following date rather
  // than omitting it, which would otherwise parse as a same-day, minutes-long day.
  const spansDates = sunriseIso?.slice(0, 10) !== sunsetIso?.slice(0, 10)

  // With no usable sun events there is no position to mark; empty clock strings
  // tell the arc to draw its track only.
  if (
    nowMinutes === null ||
    sunriseMinutes === null ||
    sunsetMinutes === null ||
    spansDates ||
    sunsetMinutes <= sunriseMinutes
  ) {
    return { sunrise: '', sunset: '', progress: 0, phase: 'daylight', until: null, ...durations }
  }

  const phase = sunPhase(nowMinutes, sunriseMinutes, sunsetMinutes)
  const minutesUntil = minutesUntilNextSunEvent(
    phase,
    nowMinutes,
    sunriseMinutes,
    sunsetMinutes,
    isoMinutesOrNull(daily.sunrise[1])
  )

  return {
    sunrise: formatClock(sunriseIso),
    sunset: formatClock(sunsetIso),
    progress: dayProgress(current.time, sunriseIso, sunsetIso),
    phase,
    until: formatDuration(minutesUntil === null ? null : minutesUntil * 60),
    ...durations,
  }
}

const HPA_PER_INHG = 33.8639
const FEET_PER_MILE = 5280
const METRES_PER_KM = 1000
// Meteorological rule of thumb: under 1 hPa over three hours is not a real move.
const PRESSURE_TREND_THRESHOLD_HPA = 1

function formatPressure(hpa: number | null | undefined, units: UnitSystem): string | null {
  if (isMissing(hpa)) return null
  return units === 'imperial' ? (hpa / HPA_PER_INHG).toFixed(2) : String(Math.round(hpa))
}

/**
 * Compares the current reading against three hours earlier. `hourly` starts at
 * midnight local, so between 12 AM and 3 AM this falls back to the earliest hour
 * available rather than reporting nothing.
 */
function pressureTrend(response: ForecastResponse, currentHpa: number | null | undefined): PressureTrend {
  const series = response.hourly.pressure_msl
  if (!series || isMissing(currentHpa)) return 'steady'

  const nowIdx = findCurrentHourIndex(response.hourly.time, response.current.time)
  const pastIdx = Math.max(0, nowIdx - 3)
  if (pastIdx === nowIdx) return 'steady'

  const past = series[pastIdx]
  if (isMissing(past)) return 'steady'

  const delta = currentHpa - past
  if (delta >= PRESSURE_TREND_THRESHOLD_HPA) return 'rising'
  if (delta <= -PRESSURE_TREND_THRESHOLD_HPA) return 'falling'
  return 'steady'
}

/** Open-Meteo reports visibility in feet when `precipitation_unit` is inches, metres otherwise. */
function formatVisibility(response: ForecastResponse, units: UnitSystem): string | null {
  const series = response.hourly.visibility
  if (!series) return null

  const raw = series[findCurrentHourIndex(response.hourly.time, response.current.time)]
  if (isMissing(raw)) return null

  const value = units === 'imperial' ? raw / FEET_PER_MILE : raw / METRES_PER_KM
  // Decimals only matter when visibility is genuinely reduced.
  return value >= 10 ? String(Math.round(value)) : value.toFixed(1)
}

function formatPrecipitation(total: number | null | undefined, units: UnitSystem): string | null {
  if (isMissing(total)) return null
  return units === 'imperial' ? total.toFixed(2) : total.toFixed(1)
}

export function toWeatherStats(response: ForecastResponse, units: UnitSystem): WeatherStats {
  const config = UNIT_CONFIG[units]
  const { current, daily } = response
  return {
    sun: toSunStat(response),
    wind: {
      value: Math.round(current.wind_speed_10m),
      unit: config.windLabel,
      direction: bearingToCompass(current.wind_direction_10m),
      bearing: Math.round(current.wind_direction_10m) % 360,
      gusts: roundOrNull(current.wind_gusts_10m),
    },
    uv: {
      value: roundOrNull(current.uv_index),
      level: uvLevel(current.uv_index),
    },
    humidity: {
      value: roundOrNull(current.relative_humidity_2m),
      dewPoint: roundOrNull(current.dew_point_2m),
    },
    precipitation: {
      total: formatPrecipitation(daily.precipitation_sum?.[0], units),
      unit: config.precipitationLabel,
      hours: roundOrNull(daily.precipitation_hours?.[0]),
    },
    pressure: {
      value: formatPressure(current.pressure_msl, units),
      unit: config.pressureLabel,
      trend: pressureTrend(response, current.pressure_msl),
    },
    visibility: {
      value: formatVisibility(response, units),
      unit: config.visibilityLabel,
    },
  }
}

const AQI_CATEGORIES: { ceiling: number; category: AqiCategory; label: string }[] = [
  { ceiling: 50, category: 'good', label: 'Good' },
  { ceiling: 100, category: 'moderate', label: 'Moderate' },
  { ceiling: 150, category: 'sensitive', label: 'Sensitive groups' },
  { ceiling: 200, category: 'unhealthy', label: 'Unhealthy' },
  { ceiling: 300, category: 'veryUnhealthy', label: 'Very unhealthy' },
  { ceiling: Infinity, category: 'hazardous', label: 'Hazardous' },
]

export function toAirQuality(response: AirQualityResponse | null): AirQuality | null {
  const aqi = response?.current?.us_aqi
  if (isMissing(aqi)) return null

  const rounded = Math.round(aqi)
  const match = AQI_CATEGORIES.find((entry) => rounded <= entry.ceiling) ?? AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
  const pm25 = response?.current?.pm2_5

  return {
    aqi: rounded,
    category: match.category,
    label: match.label,
    pm25: isMissing(pm25) ? null : Math.round(pm25 * 10) / 10,
  }
}
