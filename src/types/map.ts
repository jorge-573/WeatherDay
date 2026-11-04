/** `[latitude, longitude]`. */
export type LatLng = [number, number]

/** `[[southLat, westLng], [northLat, eastLng]]`. */
export type LatLngBounds = [LatLng, LatLng]

export type MapViewportTarget =
  | { kind: 'center'; center: LatLng; zoom: number }
  | { kind: 'bounds'; bounds: LatLngBounds }

export type MapViewport = MapViewportTarget & { revision: number }
