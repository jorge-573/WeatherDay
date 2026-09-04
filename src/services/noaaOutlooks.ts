import type {
  OutlookLayerDetails,
  OutlookLegendItem,
  SpcFeatureCollection,
  SpcFeatureProperties,
} from '../types/outlooks'

const SPC_REST_URL = 'https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/SPC_wx_outlks/MapServer'

export const SPC_ATTRIBUTION =
  'Outlooks &copy; <a href="https://www.spc.noaa.gov/">NOAA/NWS Storm Prediction Center</a>'

type LegendResponse = {
  layers?: Array<{
    layerId: number
    legend?: OutlookLegendItem[]
  }>
}

let legendRequest: Promise<LegendResponse> | null = null

function fetchLegendDocument(): Promise<LegendResponse> {
  if (legendRequest) return legendRequest

  legendRequest = fetch(`${SPC_REST_URL}/legend?f=json`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`NOAA legend request failed: ${response.status}`)
      return (await response.json()) as LegendResponse
    })
    .catch((error: unknown) => {
      legendRequest = null
      throw error
    })

  return legendRequest
}

async function fetchLegend(layerId: number): Promise<OutlookLegendItem[]> {
  const document = await fetchLegendDocument()
  return document.layers?.find((layer) => layer.layerId === layerId)?.legend ?? []
}

function timingValue(properties: SpcFeatureProperties | undefined, field: 'valid' | 'expire'): string | number | null {
  const value = properties?.[field]
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

export async function fetchSpcLegend(layerId: number, significantLayerId?: number): Promise<OutlookLegendItem[]> {
  const [legend, significantLegend] = await Promise.all([
    fetchLegend(layerId),
    significantLayerId ? fetchLegend(significantLayerId) : Promise.resolve([]),
  ])
  return [...legend, ...significantLegend]
}

function timingFromCollection(
  data: SpcFeatureCollection | null
): Pick<OutlookLayerDetails, 'validTime' | 'expireTime'> {
  const properties = data?.features[0]?.properties
  return {
    validTime: timingValue(properties, 'valid'),
    expireTime: timingValue(properties, 'expire'),
  }
}

export function detailsFromOutlook(
  data: SpcFeatureCollection | null,
  legend: OutlookLegendItem[]
): OutlookLayerDetails {
  return {
    legend,
    ...timingFromCollection(data),
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
