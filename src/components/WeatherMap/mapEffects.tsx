import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { MapViewport } from '../../types/map'

export function MapAttribution({ attribution }: { attribution: string }) {
  const map = useMap()

  useEffect(() => {
    map.attributionControl.addAttribution(attribution)
    return () => {
      map.attributionControl.removeAttribution(attribution)
    }
  }, [attribution, map])

  return null
}

export function MapCenter({ latitude, longitude, zoom }: { latitude: number; longitude: number; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView([latitude, longitude], zoom)
  }, [map, latitude, longitude, zoom])

  return null
}

export function MapViewportController({ viewport }: { viewport: MapViewport }) {
  const map = useMap()

  useEffect(() => {
    if (viewport.kind === 'center') {
      map.setView(viewport.center, viewport.zoom)
    } else {
      map.fitBounds(viewport.bounds, { padding: [16, 16] })
    }
  }, [map, viewport])

  return null
}
