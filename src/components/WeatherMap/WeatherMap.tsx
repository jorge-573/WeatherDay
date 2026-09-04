import { useEffect, type PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { MapContainer, useMap } from 'react-leaflet'
import type { MapViewport } from '../../types/outlooks'
import { DarkBasemap } from './DarkBasemap'

type WeatherMapProps = PropsWithChildren<{
  viewport: MapViewport
  attribution: string
}>

function ViewportController({ viewport }: { viewport: MapViewport }) {
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

function ProviderAttribution({ attribution }: { attribution: string }) {
  const map = useMap()

  useEffect(() => {
    map.attributionControl.addAttribution(attribution)
    return () => {
      map.attributionControl.removeAttribution(attribution)
    }
  }, [attribution, map])

  return null
}

export function WeatherMap({ viewport, attribution, children }: WeatherMapProps) {
  return (
    <Box sx={{ height: '100%', width: '100%', bgcolor: '#03060a' }}>
      <MapContainer
        center={[39, -98]}
        zoom={4}
        minZoom={3}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', backgroundColor: '#03060a' }}
      >
        <DarkBasemap>{children}</DarkBasemap>
        <ViewportController viewport={viewport} />
        <ProviderAttribution attribution={attribution} />
      </MapContainer>
    </Box>
  )
}
