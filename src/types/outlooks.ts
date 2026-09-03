import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'

export type OutlookProduct = 'severe' | 'temperature'
export type SpcDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type SpcOutlookType = 'categorical' | 'probabilistic' | 'tornado' | 'wind' | 'hail'
export type TemperatureKind = 'high' | 'low'
export type TemperatureDay = 1 | 2 | 3

export type SpcLayerDefinition = {
  layerId: number
  wmsLayerId: number
  label: string
}

export type TemperatureLayerDefinition = {
  layerId: number
  timingLayerId: number
  label: string
}

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

export type MapViewportTarget =
  | { kind: 'center'; center: LatLngExpression; zoom: number }
  | { kind: 'bounds'; bounds: LatLngBoundsExpression }

export type MapViewport = MapViewportTarget & { revision: number }

export type StateBounds = {
  code: string
  name: string
  bounds: LatLngBoundsExpression
}
