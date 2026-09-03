import type { OutlookLayerDetails, OutlookLegendItem, SpcFeatureCollection } from '../types/outlooks'

const SPC_REST_URL = 'https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer'

export const SPC_ATTRIBUTION =
  'Outlooks &copy; <a href="https://www.spc.noaa.gov/">NOAA/NWS Storm Prediction Center</a>'

type LegendResponse = {
  layers?: Array<{
    layerId: number
    legend?: OutlookLegendItem[]
  }>
}

type QueryResponse = {
  features?: Array<{
    attributes?: Record<string, unknown>
  }>
}

let legendRequest: Promise<LegendResponse> | null = null

function fetchLegendDocument(): Promise<LegendResponse> {
  if (legendRequest) return legendRequest

  legendRequest = fetch(`${SPC_REST_URL}/legend?f=json`).then(async (response) => {
    if (!response.ok) throw new Error(`NOAA legend request failed: ${response.status}`)
    return (await response.json()) as LegendResponse
  })
  return legendRequest
}

async function fetchLegend(layerId: number): Promise<OutlookLegendItem[]> {
  const document = await fetchLegendDocument()
  return document.layers?.find((layer) => layer.layerId === layerId)?.legend ?? []
}

function timingValue(attributes: Record<string, unknown> | undefined, field: string): string | number | null {
  const value = attributes?.[field]
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

async function fetchTiming(
  layerId: number,
  signal?: AbortSignal
): Promise<Pick<OutlookLayerDetails, 'validTime' | 'expireTime'>> {
  const url = new URL(`${SPC_REST_URL}/${layerId}/query`)
  url.searchParams.set('where', '1=1')
  url.searchParams.set('outFields', 'valid,expire')
  url.searchParams.set('returnGeometry', 'false')
  url.searchParams.set('resultRecordCount', '1')
  url.searchParams.set('f', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`NOAA timing request failed: ${response.status}`)

  const data = (await response.json()) as QueryResponse
  const attributes = data.features?.[0]?.attributes
  return {
    validTime: timingValue(attributes, 'valid'),
    expireTime: timingValue(attributes, 'expire'),
  }
}

export async function fetchSpcLayerDetails(
  layerId: number,
  significantLayerId?: number,
  signal?: AbortSignal
): Promise<OutlookLayerDetails> {
  const [legendResult, timingResult] = await Promise.allSettled([fetchLegend(layerId), fetchTiming(layerId, signal)])

  if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError')

  const legend = legendResult.status === 'fulfilled' ? legendResult.value : []
  const significantLegend = significantLayerId ? await fetchLegend(significantLayerId).catch(() => []) : []

  return {
    legend: [...legend, ...significantLegend],
    validTime: timingResult.status === 'fulfilled' ? timingResult.value.validTime : null,
    expireTime: timingResult.status === 'fulfilled' ? timingResult.value.expireTime : null,
  }
}

async function fetchSpcGeoJsonLayer(layerId: number, signal?: AbortSignal): Promise<SpcFeatureCollection> {
  const url = new URL(`${SPC_REST_URL}/${layerId}/query`)
  url.searchParams.set('where', '1=1')
  url.searchParams.set('outFields', '*')
  url.searchParams.set('returnGeometry', 'true')
  url.searchParams.set('outSR', '4326')
  url.searchParams.set('f', 'geojson')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`SPC outlook request failed: ${response.status}`)
  return (await response.json()) as SpcFeatureCollection
}

export async function fetchSpcGeoJson(
  layerId: number,
  significantLayerId?: number,
  signal?: AbortSignal
): Promise<SpcFeatureCollection> {
  const layerIds = significantLayerId ? [layerId, significantLayerId] : [layerId]
  const collections = await Promise.all(layerIds.map((id) => fetchSpcGeoJsonLayer(id, signal)))
  return {
    type: 'FeatureCollection',
    features: collections.flatMap((collection) => collection.features),
  }
}
