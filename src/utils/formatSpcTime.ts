export function formatSpcTime(value: string | number | null): string | null {
  if (value === null) return null

  const compactUtc = typeof value === 'string' ? value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/) : null
  const normalizedValue = compactUtc
    ? Date.UTC(
        Number(compactUtc[1]),
        Number(compactUtc[2]) - 1,
        Number(compactUtc[3]),
        Number(compactUtc[4]),
        Number(compactUtc[5])
      )
    : value

  if (typeof normalizedValue === 'string' && Number.isNaN(Date.parse(normalizedValue))) return normalizedValue

  const date = new Date(normalizedValue)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}
