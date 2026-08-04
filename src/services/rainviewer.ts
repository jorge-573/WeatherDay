import type { RadarFrame } from './radar'

const WEATHER_MAPS_URL = 'https://api.rainviewer.com/public/weather-maps.json'

export const RAINVIEWER_ATTRIBUTION = 'Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>'

// Most recent past frames to keep (older frames add tiles without much value).
// Every mounted frame reloads the viewport when the map moves, so the count is
// the main lever on how many tiles a pan or zoom costs.
const MAX_PAST_FRAMES = 6

/**
 * Color scheme 2 = "Universal Blue": rain runs cyan -> blue -> yellow -> red,
 * with a separate blue/white snow palette.
 */
const COLOR_SCHEME = 2
/**
 * 512px tiles come from the same {z}/{x}/{y} grid as the 256px ones, so each
 * covers twice the ground per axis and a view needs a quarter as many requests.
 * Leaflet scales its tile grid by `tileSize`, so the URL zoom must drop by one
 * to keep the overlay aligned; the radar renders one zoom level softer.
 */
const TILE_SIZE = 512
const ZOOM_OFFSET = -1
const SMOOTHING = 1
const SNOW = 1

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

/** Builds a Leaflet-compatible tile URL template ({z}/{x}/{y}) for a frame. */
function buildTileUrl(host: string, path: string): string {
  return `${host}${path}/${TILE_SIZE}/{z}/{x}/{y}/${COLOR_SCHEME}/${SMOOTHING}_${SNOW}.png`
}

function toFrame(host: string, raw: RawFrame, isForecast: boolean): RadarFrame {
  return {
    id: raw.path,
    time: raw.time,
    isForecast,
    render: { type: 'xyz', url: buildTileUrl(host, raw.path), tileSize: TILE_SIZE, zoomOffset: ZOOM_OFFSET },
  }
}

/** Observed frames followed by nowcast frames, in chronological order. */
export async function fetchRainviewerFrames(signal?: AbortSignal): Promise<RadarFrame[]> {
  const res = await fetch(WEATHER_MAPS_URL, { signal })
  if (!res.ok) {
    throw new Error(`Radar request failed: ${res.status}`)
  }

  const data = (await res.json()) as WeatherMapsResponse
  // Cap the past frames to keep the total tile volume (and request load) modest.
  const past = (data.radar?.past ?? []).slice(-MAX_PAST_FRAMES).map((raw) => toFrame(data.host, raw, false))
  const nowcast = (data.radar?.nowcast ?? []).map((raw) => toFrame(data.host, raw, true))

  return [...past, ...nowcast]
}
