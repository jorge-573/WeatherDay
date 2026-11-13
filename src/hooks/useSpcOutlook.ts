import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { detailsFromOutlook, fetchSpcGeoJson, fetchSpcLegend } from '../services/noaaOutlooks'
import type { OutlookLayerDetails, SpcFeatureCollection } from '../types/outlooks'

/** SPC reissues outlooks a handful of times a day. */
const REFRESH_INTERVAL_MS = 15 * 60_000
const STALE_TIME_MS = 5 * 60_000

type SpcOutlookState = {
  data: SpcFeatureCollection | null
  details: OutlookLayerDetails | null
  loading: boolean
  error: string | null
  detailsError: string | null
}

export function useSpcOutlook(layerId: number, significantLayerId?: number): SpcOutlookState {
  const outlook = useQuery({
    queryKey: ['spcOutlook', layerId, significantLayerId],
    queryFn: ({ signal }) => fetchSpcGeoJson(layerId, significantLayerId, signal),
    staleTime: STALE_TIME_MS,
    refetchInterval: REFRESH_INTERVAL_MS,
  })
  // Legend symbology is static for a layer, so it is fetched once per session.
  const legend = useQuery({
    queryKey: ['spcLegend', layerId, significantLayerId],
    queryFn: () => fetchSpcLegend(layerId, significantLayerId),
    staleTime: Infinity,
  })

  const loading = outlook.isPending || legend.isPending
  const data = outlook.data ?? null
  const details = useMemo(
    () => (loading ? null : detailsFromOutlook(data, legend.data ?? [])),
    [loading, data, legend.data]
  )

  return {
    data,
    details,
    loading,
    error: outlook.error ? outlook.error.message || 'Could not load the SPC outlook' : null,
    detailsError: legend.error ? legend.error.message || 'Could not load NOAA layer details' : null,
  }
}
