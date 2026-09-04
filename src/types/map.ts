import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'

export type MapViewportTarget =
  | { kind: 'center'; center: LatLngExpression; zoom: number }
  | { kind: 'bounds'; bounds: LatLngBoundsExpression }

export type MapViewport = MapViewportTarget & { revision: number }
