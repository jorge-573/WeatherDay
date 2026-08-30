const POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const

const SLICE = 360 / POINTS.length

export function bearingToCompass(bearing: number): (typeof POINTS)[number] {
  const normalized = ((bearing % 360) + 360) % 360
  return POINTS[Math.round(normalized / SLICE) % POINTS.length]
}

export function formatWindFrom(bearing: number): string {
  const degrees = ((Math.round(bearing) % 360) + 360) % 360
  return `From ${bearingToCompass(bearing)} · ${degrees}°`
}
