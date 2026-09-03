import { useMemo } from 'react'
import { CRS, latLngBounds } from 'leaflet'
import { ImageOverlay } from 'react-leaflet'

type ArcGisExportLayerProps = {
  url: string
  layerId: number
  opacity?: number
  onLoad?: () => void
  onError?: () => void
}

const TEMPERATURE_BOUNDS: [[number, number], [number, number]] = [
  [20.168902, -130.122931],
  [52.817017, -60.877398],
]

export function ArcGisExportLayer({ url, layerId, opacity = 1, onLoad, onError }: ArcGisExportLayerProps) {
  const imageUrl = useMemo(() => {
    const bounds = latLngBounds(TEMPERATURE_BOUNDS)
    const southwest = CRS.EPSG3857.project(bounds.getSouthWest())
    const northeast = CRS.EPSG3857.project(bounds.getNorthEast())
    const request = new URL(`${url}/export`)
    request.searchParams.set('bbox', [southwest.x, southwest.y, northeast.x, northeast.y].join(','))
    request.searchParams.set('bboxSR', '3857')
    request.searchParams.set('imageSR', '3857')
    request.searchParams.set('size', '2048,1024')
    request.searchParams.set('format', 'png32')
    request.searchParams.set('transparent', 'true')
    request.searchParams.set('layers', `show:${layerId}`)
    request.searchParams.set('f', 'image')
    return request.toString()
  }, [layerId, url])

  return (
    <ImageOverlay
      url={imageUrl}
      bounds={TEMPERATURE_BOUNDS}
      opacity={opacity}
      zIndex={5}
      eventHandlers={{ load: onLoad, error: onError }}
    />
  )
}
