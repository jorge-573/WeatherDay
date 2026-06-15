const WEATHER_MAPS_URL = 'https://api.rainviewer.com/public/weather-maps.json'

// Most recent past frames to keep (older frames add tiles without much value).
const MAX_PAST_FRAMES = 10

export type RadarFrame = {
  /** Unix timestamp in seconds for the frame. */
  time: number
  /** API path segment used to build tile URLs. */
  path: string
  /** Observed radar ("past") vs forecast ("nowcast"). */
  kind: 'past' | 'nowcast'
}

export type RadarMaps = {
  /** Tile cache host, e.g. https://tilecache.rainviewer.com */
  host: string
  /** Past frames followed by nowcast frames, in chronological order. */
  frames: RadarFrame[]
}

type RawFrame = {
  time: number
  path: string
}

type WeatherMapsResponse = {
  host: string
  radar?: {
    past?: RawFrame[]
    nowcast?: RawFrame[]
  }
}

export async function fetchRadarMaps(signal?: AbortSignal): Promise<RadarMaps> {
  const res = await fetch(WEATHER_MAPS_URL, { signal })
  if (!res.ok) {
    throw new Error(`Radar request failed: ${res.status}`)
  }

  const data = (await res.json()) as WeatherMapsResponse
  // Cap the past frames to keep the total tile volume (and request load) modest.
  const past = (data.radar?.past ?? []).slice(-MAX_PAST_FRAMES).map<RadarFrame>((frame) => ({ ...frame, kind: 'past' }))
  const nowcast = (data.radar?.nowcast ?? []).map<RadarFrame>((frame) => ({ ...frame, kind: 'nowcast' }))

  return { host: data.host, frames: [...past, ...nowcast] }
}

export type RadarTileOptions = {
  /**
   * RainViewer color scheme (0-8). 2 = "Universal Blue": rain runs cyan -> blue
   * -> yellow -> red, with a separate blue/white snow palette.
   */
  color?: number
  size?: 256 | 512
  smooth?: boolean
  snow?: boolean
}

/** Builds a Leaflet-compatible tile URL template ({z}/{x}/{y}) for a frame. */
export function buildRadarTileUrl(host: string, frame: RadarFrame, options: RadarTileOptions = {}): string {
  const color = options.color ?? 2
  const size = options.size ?? 256
  const smooth = options.smooth === false ? 0 : 1
  const snow = options.snow === false ? 0 : 1
  return `${host}${frame.path}/${size}/{z}/{x}/{y}/${color}/${smooth}_${snow}.png`
}
