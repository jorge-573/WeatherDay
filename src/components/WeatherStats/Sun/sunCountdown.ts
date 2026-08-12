import type { SunStat } from '../../../types/weather'

/** Phrases the time to the next sun event, e.g. "Sunset in 4h 30m". */
export function sunCountdown(sun: SunStat): string | null {
  if (!sun.until) return null
  return sun.phase === 'daylight' ? `Sunset in ${sun.until}` : `Sunrise in ${sun.until}`
}
