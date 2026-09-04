import { type PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { MapContainer } from 'react-leaflet'
import type { MapViewport } from '../../types/map'
import { DarkBasemap } from './DarkBasemap'
import { MapAttribution, MapViewportController } from './mapEffects'

type WeatherMapProps = PropsWithChildren<{
  viewport: MapViewport
  attribution: string
}>

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
        <MapViewportController viewport={viewport} />
        <MapAttribution attribution={attribution} />
      </MapContainer>
    </Box>
  )
}
