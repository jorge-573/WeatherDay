import { useEffect, useState } from 'react'
import { fetchRadarMaps, type RadarFrame } from '../services/rainviewer'

type RadarFramesState = {
  host: string
  frames: RadarFrame[]
  loading: boolean
  error: string | null
}

export function useRadarFrames(): RadarFramesState {
  const [state, setState] = useState<RadarFramesState>({
    host: '',
    frames: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetchRadarMaps(controller.signal)
      .then((maps) => {
        if (controller.signal.aborted) return
        setState({ host: maps.host, frames: maps.frames, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Could not load radar'
        setState((prev) => ({ ...prev, loading: false, error: message }))
      })

    return () => controller.abort()
  }, [])

  return state
}
