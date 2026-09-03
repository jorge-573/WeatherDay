import { useEffect, useState } from 'react'
import { fetchSpcLayerDetails } from '../services/noaaOutlooks'
import type { OutlookLayerDetails } from '../types/outlooks'

type LayerDetailsState = {
  details: OutlookLayerDetails | null
  loading: boolean
  error: string | null
}

export function useOutlookLayerDetails(layerId: number, significantLayerId?: number): LayerDetailsState {
  const [state, setState] = useState<LayerDetailsState>({ details: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ details: null, loading: true, error: null })

    fetchSpcLayerDetails(layerId, significantLayerId, controller.signal)
      .then((details) => {
        if (!controller.signal.aborted) setState({ details, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          details: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load NOAA layer details',
        })
      })

    return () => controller.abort()
  }, [layerId, significantLayerId])

  return state
}
