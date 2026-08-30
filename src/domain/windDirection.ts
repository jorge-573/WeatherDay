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

const POINT_WORDS: Record<(typeof POINTS)[number], string> = {
  N: 'north',
  NNE: 'north-northeast',
  NE: 'northeast',
  ENE: 'east-northeast',
  E: 'east',
  ESE: 'east-southeast',
  SE: 'southeast',
  SSE: 'south-southeast',
  S: 'south',
  SSW: 'south-southwest',
  SW: 'southwest',
  WSW: 'west-southwest',
  W: 'west',
  WNW: 'west-northwest',
  NW: 'northwest',
  NNW: 'north-northwest',
}

const SLICE = 360 / POINTS.length

export function bearingToCompass(bearing: number): (typeof POINTS)[number] {
  const normalized = ((bearing % 360) + 360) % 360
  return POINTS[Math.round(normalized / SLICE) % POINTS.length]
}

export function formatWindFrom(bearing: number, direction?: string): string {
  const point = direction ?? bearingToCompass(bearing)
  const words = POINT_WORDS[point as (typeof POINTS)[number]] ?? point
  return `From ${words} · ${Math.round(bearing)}°`
}
