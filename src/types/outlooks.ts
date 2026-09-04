import type { FeatureCollection, Geometry } from 'geojson'

export type SpcDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type SpcOutlookType = 'categorical' | 'probabilistic' | 'tornado' | 'wind' | 'hail'

export type SpcLayerDefinition = {
  layerId: number
  significantLayerId?: number
  label: string
}

export type SpcFeatureProperties = {
  objectid?: number
  fill?: string
  stroke?: string
  label?: string
  label2?: string
  valid?: string
  expire?: string
}

export type SpcFeatureCollection = FeatureCollection<Geometry, SpcFeatureProperties>

export type OutlookLegendItem = {
  label: string
  imageData: string
  contentType: string
}

export type OutlookLayerDetails = {
  legend: OutlookLegendItem[]
  validTime: string | number | null
  expireTime: string | number | null
}
