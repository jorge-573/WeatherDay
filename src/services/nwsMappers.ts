import { UNIT_CONFIG, type UnitSystem } from '../config/units'
import type {
  CurrentWeatherSnapshot,
  DailyForecastEntry,
  GeocodingResult,
  HourlyForecastEntry,
  WeatherStats,
} from '../types/weather'
import type { NwsForecastPeriod, NwsObservation, NwsValue } from './nws'
import { getWeatherCondition } from './weatherCodes'
import {
  celsiusToFahrenheit,
  compassFromDegrees,
  formatClock,
  formatDayLabel,
  formatHour,
  formatLocation,
  formatMonthDay,
  kmhToMph,
  msToKmh,
  progressBetween,
  uvLevel,
} from './weatherFormat'

// NWS has no WMO codes. Each period carries an icon URL whose token (e.g. "tsra_hi"
// in /icons/land/night/tsra_hi,20) identifies the condition. We map that token to a
// synthetic WMO code so the existing weatherCodes/weatherIcons/scene system applies.
const ICON_TOKEN_TO_CODE: Record<string, number> = {
  skc: 0,
  few: 1,
  sct: 2,
  bkn: 3,
  ovc: 3,
  wind_skc: 0,
  wind_few: 1,
  wind_sct: 2,
  wind_bkn: 3,
  wind_ovc: 3,
  fog: 45,
  haze: 45,
  smoke: 45,
  dust: 45,
  rain: 63,
  rain_showers: 81,
  rain_showers_hi: 80,
  rain_snow: 63,
  snow: 73,
  snow_showers: 85,
  blizzard: 75,
  sleet: 66,
  fzra: 66,
  rain_fzra: 66,
  snow_fzra: 66,
  tsra: 95,
  tsra_sct: 95,
  tsra_hi: 95,
  hurricane: 95,
  tropical_storm: 95,
  tornado: 95,
}

export function nwsIconToCode(iconUrl: string): number {
  const match = /\/icons\/land\/(?:day|night)\/([^?]+)/.exec(iconUrl)
  if (!match) return 3
  const token = match[1].split('/')[0].split(',')[0]
  return ICON_TOKEN_TO_CODE[token] ?? 3
}

function iconIsNight(iconUrl: string): boolean {
  return iconUrl.includes('/night/')
}

function roundTemp(celsius: number, units: UnitSystem): number {
  return Math.round(units === 'imperial' ? celsiusToFahrenheit(celsius) : celsius)
}

// NWS shortForecast strings are verbose and sometimes compound ("X then Y"),
// which overflows the compact cells. Use the concise WMO label that matches the
// icon for hourly/daily, and trim compound phrases for the current headline.
function shortenForecast(text?: string): string {
  return text ? text.split(' then ')[0] : ''
}

export function toHourlyFromNws(periods: NwsForecastPeriod[]): HourlyForecastEntry[] {
  return periods.slice(0, 24).map((period, i) => {
    const isNow = i === 0
    const code = nwsIconToCode(period.icon)
    return {
      hour: isNow ? 'Now' : formatHour(period.startTime),
      temperature: Math.round(period.temperature),
      code,
      condition: getWeatherCondition(code).label,
      isNight: !period.isDaytime,
      isNow,
    }
  })
}

type DayBucket = { date: string; dayPeriod?: NwsForecastPeriod; temps: number[] }

export function toDailyFromNws(
  periods: NwsForecastPeriod[],
  hourly: NwsForecastPeriod[]
): DailyForecastEntry[] {
  // Group periods by local calendar date (preserving NWS's chronological order)
  // for the condition/icon, then fold in the hourly temps so each day's high/low
  // is a real range -- the daily periods alone miss the daytime high once it has
  // already passed (e.g. late at night "today" would only carry the overnight low).
  const order: string[] = []
  const buckets = new Map<string, DayBucket>()

  for (const period of periods) {
    const date = period.startTime.slice(0, 10)
    let bucket = buckets.get(date)
    if (!bucket) {
      bucket = { date, temps: [] }
      buckets.set(date, bucket)
      order.push(date)
    }
    bucket.temps.push(period.temperature)
    if (period.isDaytime && !bucket.dayPeriod) bucket.dayPeriod = period
  }

  for (const hour of hourly) {
    buckets.get(hour.startTime.slice(0, 10))?.temps.push(hour.temperature)
  }

  return order.map((date, index) => {
    const { dayPeriod, temps } = buckets.get(date)!
    const source = dayPeriod ?? periodAtDate(periods, date)
    const code = source ? nwsIconToCode(source.icon) : 3
    return {
      day: formatDayLabel(date, index),
      date: formatMonthDay(date),
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      code,
      condition: getWeatherCondition(code).label,
    }
  })
}

function periodAtDate(periods: NwsForecastPeriod[], date: string): NwsForecastPeriod | undefined {
  return periods.find((p) => p.startTime.slice(0, 10) === date)
}

export function toCurrentFromNws(
  observation: NwsObservation | null,
  hourly: NwsForecastPeriod[],
  daily: DailyForecastEntry[],
  city: GeocodingResult,
  units: UnitSystem
): CurrentWeatherSnapshot {
  const first = hourly[0]
  const tempC = observation?.temperature.value
  const useObs = observation != null && tempC != null

  const temperature = useObs ? roundTemp(tempC, units) : Math.round(first?.temperature ?? 0)
  const feelsC = observation?.heatIndex.value ?? observation?.windChill.value ?? tempC
  const feelsLike = useObs && feelsC != null ? roundTemp(feelsC, units) : temperature

  const iconUrl = (useObs && observation?.icon) || first?.icon || ''
  const code = iconUrl ? nwsIconToCode(iconUrl) : 3
  const condition =
    (useObs && observation?.textDescription) ||
    shortenForecast(first?.shortForecast) ||
    getWeatherCondition(code).label
  const isNight = iconUrl ? iconIsNight(iconUrl) : !(first?.isDaytime ?? true)
  const today = daily[0]

  return {
    location: formatLocation(city),
    temperature,
    condition,
    code,
    isNight,
    group: getWeatherCondition(code).group,
    high: today?.high ?? temperature,
    low: today?.low ?? temperature,
    feelsLike,
  }
}

// Observation wind is SI; normalize to km/h regardless of the reported unit.
function observationWindKmh(wind: NwsValue): number | null {
  if (wind?.value == null) return null
  return wind.unitCode?.includes('m_s') ? msToKmh(wind.value) : wind.value
}

function parseWindSpeed(text?: string): number | null {
  const numbers = text?.match(/\d+/g)
  if (!numbers) return null
  return Math.max(...numbers.map(Number))
}

export function toStatsFromNws(
  observation: NwsObservation | null,
  currentPeriod: NwsForecastPeriod | undefined,
  sunrise: string | undefined,
  sunset: string | undefined,
  uv: number | null,
  units: UnitSystem
): WeatherStats {
  const config = UNIT_CONFIG[units]

  const windKmh = observationWindKmh(observation?.windSpeed ?? { value: null })
  const windValue =
    windKmh != null
      ? Math.round(units === 'imperial' ? kmhToMph(windKmh) : windKmh)
      : (parseWindSpeed(currentPeriod?.windSpeed) ?? 0)

  const direction =
    observation?.windDirection.value != null
      ? compassFromDegrees(observation.windDirection.value)
      : (currentPeriod?.windDirection ?? '')

  return {
    sun: {
      sunrise: sunrise ? formatClock(sunrise) : '',
      sunset: sunset ? formatClock(sunset) : '',
      progress:
        sunrise && sunset ? progressBetween(Date.now(), Date.parse(sunrise), Date.parse(sunset)) : 0,
    },
    wind: {
      value: windValue,
      unit: config.windLabel,
      direction,
    },
    uv: {
      value: uv != null ? Math.round(uv) : null,
      level: uvLevel(uv ?? undefined),
    },
  }
}
