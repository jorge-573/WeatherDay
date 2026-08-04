import type { RadarBounds, RadarFrame, RadarWmsParams } from '../types/radar'

// NOAA MRMS (Multi-Radar/Multi-Sensor) base reflectivity, served as a
// time-enabled OGC WMS over a ~4 hour rolling window.
const WMS_URL =
  'https://mapservices.weather.noaa.gov/eventdriven/services/radar/radar_base_reflectivity_time/ImageServer/WMSServer'
const WMS_LAYER = 'radar_base_reflectivity_time'

export const NOAA_ATTRIBUTION = 'Radar &copy; <a href="https://www.weather.gov/">NOAA/NWS</a> MRMS'

/** Frames sampled across the animation window. */
const FRAME_COUNT = 8
/** How far back the animation reaches. */
const WINDOW_MS = 100 * 60 * 1000
/** Held back from "now" so the newest frame sits behind the latest scan. */
const LATEST_OFFSET_MS = 4 * 60 * 1000
/**
 * GetMap renders any bbox at the size we ask for, so large tiles are safe here
 * and cover the view in a quarter of the requests 256px tiles would need.
 */
const TILE_SIZE = 512

/** The regional domains MRMS publishes. Elsewhere it returns empty imagery. */
export type NoaaRegion = 'conus' | 'alaska' | 'hawaii' | 'caribbean' | 'guam'

const REGION_BOUNDS: Record<NoaaRegion, RadarBounds> = {
  conus: [
    [20, -130],
    [55, -60],
  ],
  alaska: [
    [50, -170],
    [72, -129],
  ],
  hawaii: [
    [17, -161],
    [24, -153],
  ],
  caribbean: [
    [16, -68],
    [20, -63],
  ],
  guam: [
    [12, 143],
    [16, 148],
  ],
}

/** The MRMS domain covering a point, or null when it has no coverage. */
export function findNoaaRegion(latitude: number, longitude: number): NoaaRegion | null {
  const match = Object.entries(REGION_BOUNDS).find(
    ([, [[south, west], [north, east]]]) =>
      latitude >= south && latitude <= north && longitude >= west && longitude <= east
  )
  return match ? (match[0] as NoaaRegion) : null
}

function buildWmsParams(time: string): RadarWmsParams {
  return {
    layers: WMS_LAYER,
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    time,
  }
}

/**
 * Frames for the recent past, oldest first.
 *
 * The window comes from the clock rather than the service's published
 * `timeInfo.timeExtent`, which lags the available imagery by up to 20 minutes
 * and would drop the newest radar from the animation. Requests need not match a
 * scan exactly: the `time` dimension is a continuous range, and the service
 * resolves each instant to the scan covering it.
 */
export function buildNoaaFrames(region: NoaaRegion): RadarFrame[] {
  const endMs = Date.now() - LATEST_OFFSET_MS
  const step = WINDOW_MS / (FRAME_COUNT - 1)
  const bounds = REGION_BOUNDS[region]

  return Array.from({ length: FRAME_COUNT }, (_, index): RadarFrame => {
    const timeMs = Math.round(endMs - WINDOW_MS + step * index)
    return {
      id: `noaa-${region}-${timeMs}`,
      time: Math.round(timeMs / 1000),
      isForecast: false,
      render: {
        type: 'wms',
        url: WMS_URL,
        params: buildWmsParams(new Date(timeMs).toISOString()),
        tileSize: TILE_SIZE,
        bounds,
      },
    }
  })
}
