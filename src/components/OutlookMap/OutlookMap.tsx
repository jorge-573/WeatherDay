import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { WMSTileLayer } from 'react-leaflet'
import { defaultSpcType, SPC_LAYERS, TEMPERATURE_LAYERS, temperatureDaysForKind } from '../../config/outlooks'
import { CONUS_BOUNDS, STATE_BOUNDS } from '../../config/stateBounds'
import { useOutlookLayerDetails } from '../../hooks/useOutlookLayerDetails'
import {
  SPC_ATTRIBUTION,
  SPC_WMS_URL,
  TEMPERATURE_ATTRIBUTION,
  TEMPERATURE_MAPSERVER_URL,
} from '../../services/noaaOutlooks'
import type {
  MapViewport,
  MapViewportTarget,
  OutlookProduct,
  SpcDay,
  SpcOutlookType,
  TemperatureDay,
  TemperatureKind,
} from '../../types/outlooks'
import type { GeocodingResult } from '../../types/weather'
import { StatusMessage } from '../shared'
import { ArcGisExportLayer, WeatherMap } from '../WeatherMap'
import { MAP_OVERLAY_Z_INDEX, MAP_PANEL_SX } from '../WeatherMap/panel'
import { OutlookControls } from './OutlookControls'
import { OutlookLegend } from './OutlookLegend'

type OutlookMapProps = {
  city: GeocodingResult
}

export function OutlookMap({ city }: OutlookMapProps) {
  const [product, setProduct] = useState<OutlookProduct>('severe')
  const [spcDay, setSpcDay] = useState<SpcDay>(1)
  const [spcType, setSpcType] = useState<SpcOutlookType>('categorical')
  const [temperatureKind, setTemperatureKind] = useState<TemperatureKind>('high')
  const [temperatureDay, setTemperatureDay] = useState<TemperatureDay>(1)
  const [region, setRegion] = useState('us')
  const [viewport, setViewport] = useState<MapViewport>({
    kind: 'bounds',
    bounds: CONUS_BOUNDS,
    revision: 0,
  })
  const [layerLoading, setLayerLoading] = useState(true)
  const [layerError, setLayerError] = useState<string | null>(null)

  const spcLayer = SPC_LAYERS[spcDay][spcType] ?? SPC_LAYERS[spcDay][defaultSpcType(spcDay)]!
  const temperatureLayer =
    TEMPERATURE_LAYERS[temperatureKind][temperatureDay] ?? TEMPERATURE_LAYERS[temperatureKind][1]!
  const activeLayer = product === 'severe' ? spcLayer : temperatureLayer
  const layerKey = `${product}-${product === 'severe' ? spcLayer.wmsLayerId : temperatureLayer.layerId}`

  useEffect(() => {
    setLayerLoading(true)
    setLayerError(null)
  }, [layerKey])

  const detailsRequest = useMemo(
    () =>
      product === 'severe'
        ? ({ source: 'spc', layerId: spcLayer.layerId } as const)
        : ({
            source: 'temperature',
            timingLayerId: temperatureLayer.timingLayerId,
          } as const),
    [product, spcLayer.layerId, temperatureLayer.timingLayerId]
  )
  const { details, loading: detailsLoading, error: detailsError } = useOutlookLayerDetails(detailsRequest)

  const changeViewport = (next: MapViewportTarget) => {
    setViewport((current) => ({ ...next, revision: current.revision + 1 }))
  }

  const handleSpcDayChange = (day: SpcDay) => {
    setSpcDay(day)
    if (!SPC_LAYERS[day][spcType]) setSpcType(defaultSpcType(day))
  }

  const handleTemperatureKindChange = (kind: TemperatureKind) => {
    setTemperatureKind(kind)
    if (!TEMPERATURE_LAYERS[kind][temperatureDay]) {
      setTemperatureDay(temperatureDaysForKind(kind)[0])
    }
  }

  const handleRegionChange = (nextRegion: string) => {
    setRegion(nextRegion)
    const bounds = nextRegion === 'us' ? CONUS_BOUNDS : STATE_BOUNDS.find((state) => state.code === nextRegion)?.bounds
    if (bounds) changeViewport({ kind: 'bounds', bounds })
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'rgba(6, 10, 16, 0.78)' }}>
        <OutlookControls
          product={product}
          spcDay={spcDay}
          spcType={spcType}
          temperatureDay={temperatureDay}
          temperatureKind={temperatureKind}
          region={region}
          onProductChange={setProduct}
          onSpcDayChange={handleSpcDayChange}
          onSpcTypeChange={setSpcType}
          onTemperatureDayChange={setTemperatureDay}
          onTemperatureKindChange={handleTemperatureKindChange}
          onRegionChange={handleRegionChange}
          onMyLocation={() =>
            changeViewport({
              kind: 'center',
              center: [city.latitude, city.longitude],
              zoom: 7,
            })
          }
          onFullUs={() => {
            setRegion('us')
            changeViewport({ kind: 'bounds', bounds: CONUS_BOUNDS })
          }}
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
        <WeatherMap viewport={viewport} attribution={product === 'severe' ? SPC_ATTRIBUTION : TEMPERATURE_ATTRIBUTION}>
          {product === 'severe' ? (
            <WMSTileLayer
              key={layerKey}
              url={SPC_WMS_URL}
              params={{
                layers: String(spcLayer.wmsLayerId),
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
              }}
              bounds={CONUS_BOUNDS}
              opacity={0.68}
              zIndex={5}
              updateWhenZooming={false}
              updateWhenIdle
              eventHandlers={{
                loading: () => {
                  setLayerLoading(true)
                  setLayerError(null)
                },
                load: () => setLayerLoading(false),
                tileerror: () => {
                  setLayerLoading(false)
                  setLayerError('NOAA map imagery could not be loaded.')
                },
              }}
            />
          ) : (
            <ArcGisExportLayer
              key={layerKey}
              url={TEMPERATURE_MAPSERVER_URL}
              layerId={activeLayer.layerId}
              opacity={0.78}
              onLoad={() => setLayerLoading(false)}
              onError={() => {
                setLayerLoading(false)
                setLayerError('NOAA map imagery could not be loaded.')
              }}
            />
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
          <OutlookLegend
            title={activeLayer.label}
            details={details}
            loading={detailsLoading}
            error={detailsError}
            temperatureScale={product === 'temperature'}
          />
        </Box>

        {(layerLoading || layerError) && (
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
            <StatusMessage inline>
              {layerError ?? `Loading ${product === 'severe' ? 'SPC outlook' : 'temperature forecast'}…`}
            </StatusMessage>
          </Box>
        )}
      </Box>

      {product === 'temperature' && (
        <Typography
          variant="caption"
          sx={{ display: 'block', px: { xs: 1.5, sm: 2 }, py: 1.25, color: 'text.secondary' }}
        >
          NOAA/NWS NDFD forecast shown in Fahrenheit. Coverage is limited to the contiguous United States.
        </Typography>
      )}
    </Box>
  )
}
