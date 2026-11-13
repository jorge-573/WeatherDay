import { useQuery } from '@tanstack/react-query'
import { buildNoaaFrames, findNoaaRegion } from '../services/noaaRadar'
import type { RadarFrame, RadarSource } from '../types/radar'
import { fetchRainviewerFrames } from '../services/rainviewer'

/** Both providers publish new scans every few minutes; refreshing restarts the animation, so not too often. */
const REFRESH_INTERVAL_MS = 10 * 60_000
const STALE_TIME_MS = 5 * 60_000
/** Stable so the radar map's frame-reset effect doesn't fire on every render while loading. */
const EMPTY_FRAMES: RadarFrame[] = []

type RadarFramesState = {
  frames: RadarFrame[]
  loading: boolean
  error: string | null
  /** Source actually rendered, which differs from `source` outside NOAA coverage. */
  effectiveSource: RadarSource
  /** True when NOAA was requested but the location falls outside its coverage. */
  coverageFallback: boolean
}

/**
 * Loads animation frames for the requested source. NOAA is US-only, so requests
 * for locations it does not cover fall back to RainViewer's global radar.
 */
export function useRadarFrames(source: RadarSource, latitude: number, longitude: number): RadarFramesState {
  const region = source === 'noaa' ? findNoaaRegion(latitude, longitude) : null
  const coverageFallback = source === 'noaa' && region === null
  const effectiveSource: RadarSource = coverageFallback ? 'rainviewer' : source

  // Frames only depend on the resolved source and, for NOAA, which regional
  // domain applies; moving between cities inside one domain reuses them.
  const query = useQuery({
    queryKey: ['radarFrames', effectiveSource, region],
    // NOAA frames are derived from the clock, so only RainViewer needs a request.
    queryFn: ({ signal }) => (region ? buildNoaaFrames(region) : fetchRainviewerFrames(signal)),
    staleTime: STALE_TIME_MS,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  return {
    frames: query.data ?? EMPTY_FRAMES,
    loading: query.isPending,
    error: query.error ? query.error.message || 'Could not load radar' : null,
    effectiveSource,
    coverageFallback,
  }
}
