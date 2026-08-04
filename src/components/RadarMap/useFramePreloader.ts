import { useCallback, useEffect, useState } from 'react'
import type { RadarFrame } from '../../types/radar'

// Wait this long after a tile error (e.g. a 429) before loading the next frame.
const ERROR_BACKOFF_MS = 1200

export type FramePreloader = {
  /** How many frames are mounted, and have therefore requested tiles. */
  mountedCount: number
  /** Ids of the frames whose tiles have finished loading. */
  loaded: Set<string>
  handleLoad: (index: number, id: string) => void
  handleError: (index: number) => void
}

/**
 * Loads radar frames one at a time instead of all at once. A new frame is only
 * mounted (and its tiles requested) after the previous frame finishes loading
 * or errors, which avoids the request burst that triggers provider throttling.
 */
export function useFramePreloader(frames: RadarFrame[]): FramePreloader {
  const [mountedCount, setMountedCount] = useState(0)
  const [loaded, setLoaded] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMountedCount(frames.length > 0 ? 1 : 0)
    setLoaded(new Set())
  }, [frames])

  const advanceFrom = useCallback(
    (index: number) => {
      setMountedCount((current) => (index >= current - 1 ? Math.min(current + 1, frames.length) : current))
    },
    [frames.length]
  )

  const handleLoad = useCallback(
    (index: number, id: string) => {
      setLoaded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
      advanceFrom(index)
    },
    [advanceFrom]
  )

  const handleError = useCallback(
    (index: number) => {
      window.setTimeout(() => advanceFrom(index), ERROR_BACKOFF_MS)
    },
    [advanceFrom]
  )

  return { mountedCount, loaded, handleLoad, handleError }
}
