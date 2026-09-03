import type { OutlookLayerDetails, OutlookLegendItem, SpcFeatureCollection } from '../types/outlooks'

const SPC_REST_URL = 'https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer'
const TEMPERATURE_REST_URL = 'https://mapservices.weather.noaa.gov/raster/rest/services/NDFD/NDFD_temp/MapServer'

export const TEMPERATURE_MAPSERVER_URL = TEMPERATURE_REST_URL

export const SPC_ATTRIBUTION =
  'Outlooks &copy; <a href="https://www.spc.noaa.gov/">NOAA/NWS Storm Prediction Center</a>'
export const TEMPERATURE_ATTRIBUTION =
  'Temperature forecast &copy; <a href="https://digital.weather.gov/">NOAA/NWS NDFD</a>'

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

const legendRequests = new Map<string, Promise<LegendResponse>>()

function fetchLegendDocument(restUrl: string): Promise<LegendResponse> {
  const cached = legendRequests.get(restUrl)
  if (cached) return cached

  const request = fetch(`${restUrl}/legend?f=json`).then(async (response) => {
    if (!response.ok) throw new Error(`NOAA legend request failed: ${response.status}`)
    return (await response.json()) as LegendResponse
  })
  legendRequests.set(restUrl, request)
  return request
}

async function fetchLegend(restUrl: string, layerId: number): Promise<OutlookLegendItem[]> {
  const document = await fetchLegendDocument(restUrl)
  return document.layers?.find((layer) => layer.layerId === layerId)?.legend ?? []
}

function timingValue(attributes: Record<string, unknown> | undefined, field: string): string | number | null {
  const value = attributes?.[field]
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

async function fetchTiming(
  restUrl: string,
  layerId: number,
  validField: string,
  expireField: string,
  signal?: AbortSignal
): Promise<Pick<OutlookLayerDetails, 'validTime' | 'expireTime'>> {
  const url = new URL(`${restUrl}/${layerId}/query`)
  url.searchParams.set('where', '1=1')
  url.searchParams.set('outFields', `${validField},${expireField}`)
  url.searchParams.set('returnGeometry', 'false')
  url.searchParams.set('resultRecordCount', '1')
  url.searchParams.set('f', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`NOAA timing request failed: ${response.status}`)

  const data = (await response.json()) as QueryResponse
  const attributes = data.features?.[0]?.attributes
  return {
    validTime: timingValue(attributes, validField),
    expireTime: timingValue(attributes, expireField),
  }
}

async function loadLayerDetails(
  restUrl: string,
  legendLayerId: number,
  timingLayerId: number,
  validField: string,
  expireField: string,
  signal?: AbortSignal
): Promise<OutlookLayerDetails> {
  const [legendResult, timingResult] = await Promise.allSettled([
    fetchLegend(restUrl, legendLayerId),
    fetchTiming(restUrl, timingLayerId, validField, expireField, signal),
  ])

  if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError')

  return {
    legend: legendResult.status === 'fulfilled' ? legendResult.value : [],
    validTime: timingResult.status === 'fulfilled' ? timingResult.value.validTime : null,
    expireTime: timingResult.status === 'fulfilled' ? timingResult.value.expireTime : null,
  }
}

export async function fetchSpcLayerDetails(
  layerId: number,
  significantLayerId?: number,
  signal?: AbortSignal
): Promise<OutlookLayerDetails> {
  const details = await loadLayerDetails(SPC_REST_URL, layerId, layerId, 'valid', 'expire', signal)
  if (!significantLayerId) return details

  const significantLegend = await fetchLegend(SPC_REST_URL, significantLayerId).catch(() => [])
  return { ...details, legend: [...details.legend, ...significantLegend] }
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

export async function fetchTemperatureLayerDetails(
  timingLayerId: number,
  signal?: AbortSignal
): Promise<OutlookLayerDetails> {
  try {
    const timing = await fetchTiming(TEMPERATURE_REST_URL, timingLayerId, 'idp_validtime', 'idp_validendtime', signal)
    return { legend: [], ...timing }
  } catch (error) {
    if (signal?.aborted) throw error
    return { legend: [], validTime: null, expireTime: null }
  }
}
