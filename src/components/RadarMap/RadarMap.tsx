import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { CircleMarker, MapContainer, Tooltip } from 'react-leaflet'
import { useRadarFrames } from '../../hooks/useRadarFrames'
import type { RadarSource } from '../../types/radar'
import { DarkBasemap } from '../WeatherMap/DarkBasemap'
import { MapAttribution, MapCenter } from '../WeatherMap/mapEffects'
import { MAP_OVERLAY_Z_INDEX } from '../WeatherMap/panel'
import { RadarFrameLayers } from './RadarFrameLayers'
import { RadarLegend } from './RadarLegend'
import { RadarSourceToggle } from './RadarSourceToggle'
import { RadarTimeline } from './RadarTimeline'
import { SOURCE_META } from './sources'
import { useFramePreloader } from './useFramePreloader'

type RadarMapProps = {
  latitude: number
  longitude: number
  locationName: string
}

const FRAME_INTERVAL_MS = 800
const DEFAULT_ZOOM = 7
// Start animating once at least this many frames are available.
const MIN_PLAYABLE_FRAMES = 2

export function RadarMap({ latitude, longitude, locationName }: RadarMapProps) {
  const [source, setSource] = useState<RadarSource>('noaa')
  const { frames, loading, error, effectiveSource, coverageFallback } = useRadarFrames(source, latitude, longitude)
  const { mountedCount, loaded, handleLoad, handleError } = useFramePreloader(frames)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  // Playback is limited to the frames mounted so far, and grows as they load.
  const playableCount = Math.max(1, mountedCount)
  const maxIndex = Math.max(0, playableCount - 1)

  useEffect(() => {
    setActiveIndex(0)
  }, [frames])

  useEffect(() => {
    if (!playing || loaded.size < MIN_PLAYABLE_FRAMES) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % playableCount)
    }, FRAME_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [playing, loaded.size, playableCount])

  // Hold the nearest loaded frame while the requested one is still loading, so
  // playback never blanks out mid-loop.
  const visibleIndex = useMemo(() => {
    const isLoaded = (index: number) => {
      const frame = index >= 0 && index < mountedCount ? frames[index] : undefined
      return frame !== undefined && loaded.has(frame.id)
    }

    if (isLoaded(activeIndex)) return activeIndex
    for (let offset = 1; offset < mountedCount; offset++) {
      if (isLoaded(activeIndex - offset)) return activeIndex - offset
      if (isLoaded(activeIndex + offset)) return activeIndex + offset
    }
    return activeIndex
  }, [activeIndex, frames, loaded, mountedCount])

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', backgroundColor: '#03060a' }}
      >
        <DarkBasemap>
          <RadarFrameLayers
            frames={frames}
            mountedCount={mountedCount}
            visibleIndex={visibleIndex}
            onLoad={handleLoad}
            onError={handleError}
          />
          <CircleMarker
            center={[latitude, longitude]}
            radius={6}
            pane="markerPane"
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#4aa3ff', fillOpacity: 1 }}
          >
            <Tooltip>{locationName}</Tooltip>
          </CircleMarker>
        </DarkBasemap>
        <MapCenter latitude={latitude} longitude={longitude} zoom={DEFAULT_ZOOM} />
        <MapAttribution attribution={SOURCE_META[effectiveSource].attribution} />
      </MapContainer>

      {/* Kept to the right so Leaflet's zoom control owns the top-left corner. */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          zIndex: MAP_OVERLAY_Z_INDEX,
          width: { xs: 148, sm: 176 },
        }}
      >
        <Stack spacing={1}>
          <RadarSourceToggle source={source} coverageFallback={coverageFallback} onChange={setSource} />
          {frames.length > 0 && <RadarLegend rows={SOURCE_META[effectiveSource].legend} />}
        </Stack>
      </Box>

      <RadarTimeline
        loading={loading}
        error={error}
        frame={frames[activeIndex]}
        activeIndex={Math.min(activeIndex, maxIndex)}
        maxIndex={maxIndex}
        playing={playing}
        onTogglePlay={() => setPlaying((prev) => !prev)}
        onScrub={(index) => {
          setPlaying(false)
          setActiveIndex(index)
        }}
      />
    </Box>
  )
}
