import type { GeocodingResult } from '../types/weather'

// Pure formatting and unit-conversion helpers shared by the Open-Meteo and NWS
// mapping layers. No fetching or domain assembly lives here.

export function formatLocation(city: GeocodingResult): string {
  const parts = [city.name]
  if (city.admin1) parts.push(city.admin1)
  if (city.countryCode) parts.push(city.countryCode)
  return parts.join(', ')
}

export function isoHour(iso: string): number {
  const match = /T(\d{2}):/.exec(iso)
  return match ? Number(match[1]) : new Date(iso).getHours()
}

export function isoMinutes(iso: string): number {
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0
}

export function formatHour(iso: string): string {
  const hour = isoHour(iso)
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

export function formatClock(iso: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(iso)
  if (!match) return ''
  let hour = Number(match[1])
  const minute = match[2]
  const meridiem = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${meridiem}`
}

// daily.time is a date-only string (YYYY-MM-DD); parse as a local date so the
// weekday isn't shifted a day backward in negative UTC offsets.
export function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDayLabel(iso: string, index: number): string {
  if (index === 0) return 'Today'
  return parseLocalDate(iso).toLocaleDateString('en-US', { weekday: 'short' })
}

export function formatMonthDay(iso: string): string {
  const date = parseLocalDate(iso)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export function compassFromDegrees(bearing: number): string {
  const idx = Math.round((bearing % 360) / 45) % 8
  return COMPASS[idx]
}

export function uvLevel(uv: number | undefined): string {
  if (uv === undefined) return 'No data'
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function kmhToMph(kmh: number): number {
  return kmh / 1.609344
}

export function msToKmh(ms: number): number {
  return ms * 3.6
}

// Fraction of daylight elapsed (0-1) for the sunrise/sunset progress bar.
export function progressBetween(nowMs: number, startMs: number, endMs: number): number {
  if (endMs <= startMs) return 0
  return Math.min(1, Math.max(0, (nowMs - startMs) / (endMs - startMs)))
}
