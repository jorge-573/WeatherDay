import { useEffect, useState } from 'react'
import { fetchSpcLayerDetails, fetchTemperatureLayerDetails } from '../services/noaaOutlooks'
import type { OutlookLayerDetails } from '../types/outlooks'

type LayerRequest =
  | { source: 'spc'; layerId: number; significantLayerId?: number }
  | { source: 'temperature'; timingLayerId: number }

type LayerDetailsState = {
  details: OutlookLayerDetails | null
  loading: boolean
  error: string | null
}

export function useOutlookLayerDetails(request: LayerRequest): LayerDetailsState {
  const [state, setState] = useState<LayerDetailsState>({ details: null, loading: true, error: null })
  const source = request.source
  const layerId = request.source === 'spc' ? request.layerId : null
  const significantLayerId = request.source === 'spc' ? request.significantLayerId : undefined
  const timingLayerId = request.source === 'temperature' ? request.timingLayerId : null

  useEffect(() => {
    const controller = new AbortController()
    setState({ details: null, loading: true, error: null })

    const promise =
      source === 'spc' && layerId !== null
        ? fetchSpcLayerDetails(layerId, significantLayerId, controller.signal)
        : fetchTemperatureLayerDetails(timingLayerId!, controller.signal)

    promise
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
  }, [layerId, significantLayerId, source, timingLayerId])

  return state
}
