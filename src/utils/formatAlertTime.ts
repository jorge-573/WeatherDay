import type { WeatherAlert } from '../types/weather'

/** e.g. "Mon, Aug 3, 10:45 PM". */
export function formatAlertDateTime(iso?: string): string | undefined {
  if (!iso) return undefined
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Alerts routinely run past midnight, so the day is included rather than the
// time alone, which would be ambiguous.
/** e.g. "Until Aug 4, 6:00 AM". Undefined when the alert has no end time. */
export function formatAlertUntil(alert: WeatherAlert): string | undefined {
  const until = alert.expires ?? alert.ends
  if (!until) return undefined
  return `Until ${new Date(until).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`
}
