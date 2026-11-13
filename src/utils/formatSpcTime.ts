const COMPACT_UTC = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/
// `Date.parse` is lenient enough to turn text like "Day 1" into a date, so only
// ISO-shaped strings are handed to it.
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T/

function toTimestamp(value: string | number): number | null {
  if (typeof value === 'number') return value

  const compact = COMPACT_UTC.exec(value)
  if (compact) {
    return Date.UTC(
      Number(compact[1]),
      Number(compact[2]) - 1,
      Number(compact[3]),
      Number(compact[4]),
      Number(compact[5])
    )
  }

  return ISO_DATE_TIME.test(value) ? Date.parse(value) : null
}

export function formatSpcTime(value: string | number | null): string | null {
  if (value === null) return null

  const timestamp = toTimestamp(value)
  if (timestamp === null || Number.isNaN(timestamp)) return String(value)

  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}
