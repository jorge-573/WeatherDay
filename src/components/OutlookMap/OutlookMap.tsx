import { useState } from 'react'
import Box from '@mui/material/Box'
import { defaultSpcType, SPC_LAYERS } from '../../config/outlooks'
import { CONUS_BOUNDS } from '../../config/stateBounds'
import { useOutlookLayerDetails } from '../../hooks/useOutlookLayerDetails'
import { useSpcOutlook } from '../../hooks/useSpcOutlook'
import { SPC_ATTRIBUTION } from '../../services/noaaOutlooks'
import type { MapViewport, MapViewportTarget, SpcDay, SpcOutlookType } from '../../types/outlooks'
import type { GeocodingResult } from '../../types/weather'
import { StatusMessage } from '../shared'
import { WeatherMap } from '../WeatherMap'
import { MAP_OVERLAY_Z_INDEX, MAP_PANEL_SX } from '../WeatherMap/panel'
import { OutlookControls } from './OutlookControls'
import { OutlookLegend } from './OutlookLegend'
import { SpcOutlookLayer } from './SpcOutlookLayer'

type OutlookMapProps = {
  city: GeocodingResult
}

export function OutlookMap({ city }: OutlookMapProps) {
  const [spcDay, setSpcDay] = useState<SpcDay>(1)
  const [spcType, setSpcType] = useState<SpcOutlookType>('categorical')
  const [viewport, setViewport] = useState<MapViewport>({
    kind: 'bounds',
    bounds: CONUS_BOUNDS,
    revision: 0,
  })

  const spcLayer = SPC_LAYERS[spcDay][spcType] ?? SPC_LAYERS[spcDay][defaultSpcType(spcDay)]!
  const {
    data: spcData,
    loading: spcLoading,
    error: spcError,
  } = useSpcOutlook(spcLayer.layerId, spcLayer.significantLayerId)
  const {
    details,
    loading: detailsLoading,
    error: detailsError,
  } = useOutlookLayerDetails(spcLayer.layerId, spcLayer.significantLayerId)

  const changeViewport = (next: MapViewportTarget) => {
    setViewport((current) => ({ ...next, revision: current.revision + 1 }))
  }

  const handleSpcDayChange = (day: SpcDay) => {
    setSpcDay(day)
    if (!SPC_LAYERS[day][spcType]) setSpcType(defaultSpcType(day))
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'rgba(6, 10, 16, 0.78)' }}>
        <OutlookControls
          spcDay={spcDay}
          spcType={spcType}
          onSpcDayChange={handleSpcDayChange}
          onSpcTypeChange={setSpcType}
          onMyLocation={() =>
            changeViewport({
              kind: 'center',
              center: [city.latitude, city.longitude],
              zoom: 7,
            })
          }
          onFullUs={() => changeViewport({ kind: 'bounds', bounds: CONUS_BOUNDS })}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: { xs: '58vh', sm: '62vh', md: 'calc(100vh - 390px)' },
          minHeight: { xs: 390, sm: 460, md: 520 },
          maxHeight: 760,
        }}
      >
        <WeatherMap viewport={viewport} attribution={SPC_ATTRIBUTION}>
          {spcData && (
            <SpcOutlookLayer key={`${spcLayer.layerId}-${spcLayer.significantLayerId ?? 'base'}`} data={spcData} />
          )}
        </WeatherMap>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            zIndex: MAP_OVERLAY_Z_INDEX,
          }}
        >
          <OutlookLegend title={spcLayer.label} details={details} loading={detailsLoading} error={detailsError} />
        </Box>

        {(spcLoading || spcError) && (
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 'auto' },
              bottom: { xs: 8, sm: 16 },
              zIndex: MAP_OVERLAY_Z_INDEX,
              px: 1.5,
              py: 1,
              ...MAP_PANEL_SX,
            }}
          >
            <StatusMessage inline>{spcError ?? 'Loading SPC outlook…'}</StatusMessage>
          </Box>
        )}
      </Box>
    </Box>
  )
}
