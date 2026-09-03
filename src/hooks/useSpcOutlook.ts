import { useEffect, useState } from 'react'
import { fetchSpcGeoJson } from '../services/noaaOutlooks'
import type { SpcFeatureCollection } from '../types/outlooks'

type SpcOutlookState = {
  data: SpcFeatureCollection | null
  loading: boolean
  error: string | null
}

export function useSpcOutlook(layerId: number, significantLayerId?: number): SpcOutlookState {
  const [state, setState] = useState<SpcOutlookState>({ data: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })

    fetchSpcGeoJson(layerId, significantLayerId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load the SPC outlook',
        })
      })

    return () => controller.abort()
  }, [layerId, significantLayerId])

  return state
}
