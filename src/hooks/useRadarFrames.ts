import { useEffect, useState } from 'react'
import { buildNoaaFrames, findNoaaRegion } from '../services/noaaRadar'
import type { RadarFrame, RadarSource } from '../services/radar'
import { fetchRainviewerFrames } from '../services/rainviewer'

type FetchState = {
  frames: RadarFrame[]
  loading: boolean
  error: string | null
}

type RadarFramesState = FetchState & {
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

  const [state, setState] = useState<FetchState>({ frames: [], loading: true, error: null })

  // Frames only depend on the resolved source and, for NOAA, which regional
  // domain applies; moving between cities inside one domain reuses them.
  useEffect(() => {
    const controller = new AbortController()
    setState({ frames: [], loading: true, error: null })

    // NOAA frames are derived from the clock, so only RainViewer needs a request.
    const request = region ? Promise.resolve(buildNoaaFrames(region)) : fetchRainviewerFrames(controller.signal)

    request
      .then((frames) => {
        if (controller.signal.aborted) return
        setState({ frames, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Could not load radar'
        setState({ frames: [], loading: false, error: message })
      })

    return () => controller.abort()
  }, [effectiveSource, region])

  return { ...state, effectiveSource, coverageFallback }
}
