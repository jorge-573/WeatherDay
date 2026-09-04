import { useEffect, useState } from 'react'
import { detailsFromOutlook, fetchSpcGeoJson, fetchSpcLegend } from '../services/noaaOutlooks'
import type { OutlookLayerDetails, SpcFeatureCollection } from '../types/outlooks'

type SpcOutlookState = {
  data: SpcFeatureCollection | null
  details: OutlookLayerDetails | null
  loading: boolean
  error: string | null
  detailsError: string | null
}

function errorMessage(reason: unknown, fallback: string): string {
  return reason instanceof Error ? reason.message : fallback
}

export function useSpcOutlook(layerId: number, significantLayerId?: number): SpcOutlookState {
  const [state, setState] = useState<SpcOutlookState>({
    data: null,
    details: null,
    loading: true,
    error: null,
    detailsError: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, details: null, loading: true, error: null, detailsError: null })

    Promise.allSettled([
      fetchSpcGeoJson(layerId, significantLayerId, controller.signal),
      fetchSpcLegend(layerId, significantLayerId),
    ]).then(([geoResult, legendResult]) => {
      if (controller.signal.aborted) return

      const data = geoResult.status === 'fulfilled' ? geoResult.value : null
      const legend = legendResult.status === 'fulfilled' ? legendResult.value : []

      setState({
        data,
        details: detailsFromOutlook(data, legend),
        loading: false,
        error:
          geoResult.status === 'rejected' ? errorMessage(geoResult.reason, 'Could not load the SPC outlook') : null,
        detailsError:
          legendResult.status === 'rejected'
            ? errorMessage(legendResult.reason, 'Could not load NOAA layer details')
            : null,
      })
    })

    return () => controller.abort()
  }, [layerId, significantLayerId])

  return state
}
