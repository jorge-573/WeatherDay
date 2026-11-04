import type { LatLngBounds } from './map'

/** Upstream provider for the radar imagery. */
export type RadarSource = 'rainviewer' | 'noaa'

/** WMS request params for one time step. */
export type RadarWmsParams = {
  layers: string
  format: string
  transparent: boolean
  version: string
  time: string
}

export type RadarBounds = LatLngBounds

type RadarLayerOptions = {
  /** Tile edge length in pixels. Larger tiles cover the view in fewer requests. */
  tileSize: number
  /**
   * Zoom added to the requested {z} for `xyz` sources. Serving oversized tiles
   * from the standard grid needs a matching offset, or the overlay misaligns.
   */
  zoomOffset?: number
  /** Limits requests to the area the source actually has data for. */
  bounds?: RadarBounds
}

/**
 * How a frame is drawn. `xyz` frames are plain {z}/{x}/{y} tile templates; `wms`
 * frames carry a prebuilt params object, which must stay referentially stable so
 * react-leaflet does not call `setParams` (forcing a redraw) on every render.
 */
export type RadarFrameRender = RadarLayerOptions &
  ({ type: 'xyz'; url: string } | { type: 'wms'; url: string; params: RadarWmsParams })

export type RadarFrame = {
  /** Stable unique key, used for React keys and load tracking. */
  id: string
  /** Unix timestamp in seconds. */
  time: number
  /** Forecast frame rather than observed radar. */
  isForecast: boolean
  render: RadarFrameRender
}
