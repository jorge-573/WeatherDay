import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { CircleMarker, MapContainer, TileLayer, Tooltip, WMSTileLayer, useMap } from 'react-leaflet'
import { useRadarFrames } from '../../hooks/useRadarFrames'
import { NOAA_ATTRIBUTION } from '../../services/noaaRadar'
import type { RadarFrame, RadarSource } from '../../services/radar'
import { RAINVIEWER_ATTRIBUTION } from '../../services/rainviewer'

type RadarMapProps = {
  latitude: number
  longitude: number
  locationName: string
}

const FRAME_INTERVAL_MS = 800
const DEFAULT_ZOOM = 7
const RADAR_OPACITY = 0.7
// Wait this long after a tile error (e.g. a 429) before loading the next frame.
const ERROR_BACKOFF_MS = 1200
// Start animating once at least this many frames are available.
const MIN_PLAYABLE_FRAMES = 2

const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const RADAR_ATTRIBUTION: Record<RadarSource, string> = {
  noaa: NOAA_ATTRIBUTION,
  rainviewer: RAINVIEWER_ATTRIBUTION,
}

const SOURCE_OPTIONS: Array<{ value: RadarSource; label: string; description: string }> = [
  { value: 'noaa', label: 'NOAA', description: 'NOAA MRMS radar, United States only' },
  { value: 'rainviewer', label: 'RainViewer', description: 'RainViewer radar, worldwide' },
]

type LegendRow = {
  label: string
  gradient: string
}

// Light -> heavy stops from RainViewer's official color table for the active
// "Universal Blue" scheme (color 2): rain cyan -> blue -> yellow -> red, snow in
// a separate blue/white palette.
const RAINVIEWER_LEGEND: LegendRow[] = [
  {
    label: 'Rain',
    gradient: 'linear-gradient(to right, #88ddee, #00a3e0, #005588, #ffee00, #ffaa00, #ff4400, #c10000)',
  },
  { label: 'Snow', gradient: 'linear-gradient(to right, #bfffff, #9fdfff, #7fbfff, #4f8fff, #2f6fff, #0f4fff)' },
]

// The NWS reflectivity scale the MRMS service renders with. It is a single
// intensity ramp for all precipitation types rather than split rain/snow ramps.
const NOAA_LEGEND: LegendRow[] = [
  {
    label: 'Reflectivity',
    gradient:
      'linear-gradient(to right, #04e9e7, #019ff4, #0300f4, #02fd02, #01c501, #008e00, #fdf802, #e5bc00, #fd9500, #fd0000, #d40000, #bc0000, #f800fd, #9854c6)',
  },
]

const LEGEND_ROWS: Record<RadarSource, LegendRow[]> = {
  noaa: NOAA_LEGEND,
  rainviewer: RAINVIEWER_LEGEND,
}

/** Shared look for the controls floating above the map. */
const PANEL_SX = {
  borderRadius: 2,
  backgroundColor: 'rgba(6, 10, 16, 0.82)',
  backdropFilter: 'blur(8px)',
  border: 1,
  borderColor: 'divider',
} as const

function formatFrameTime(time: number): string {
  return new Date(time * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Keeps the map centered on the active city when it changes. */
function Recenter({ latitude, longitude, zoom }: { latitude: number; longitude: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([latitude, longitude], zoom)
  }, [map, latitude, longitude, zoom])
  return null
}

/** Credits the active radar provider, swapping the entry when the source changes. */
function RadarAttribution({ credit }: { credit: string }) {
  const map = useMap()
  useEffect(() => {
    const control = map.attributionControl
    control.addAttribution(credit)
    return () => {
      control.removeAttribution(credit)
    }
  }, [map, credit])
  return null
}

type RadarSourceToggleProps = {
  source: RadarSource
  coverageFallback: boolean
  onChange: (source: RadarSource) => void
}

function RadarSourceToggle({ source, coverageFallback, onChange }: RadarSourceToggleProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 8, sm: 16 },
        left: { xs: 8, sm: 16 },
        zIndex: 1000,
        width: { xs: 148, sm: 176 },
        px: 1,
        py: 0.75,
        ...PANEL_SX,
      }}
    >
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={source}
        aria-label="Radar source"
        onChange={(_, value: RadarSource | null) => {
          if (value) onChange(value)
        }}
      >
        {SOURCE_OPTIONS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.description}
            sx={{
              px: { xs: 0.5, sm: 1 },
              py: 0.5,
              minHeight: 34,
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              fontWeight: 700,
              letterSpacing: '0.04em',
              lineHeight: 1.2,
              color: 'text.secondary',
              borderColor: 'divider',
              '&.Mui-selected': {
                color: (t) => t.md3.accent,
                backgroundColor: (t) => t.md3.surfaceBright,
                '&:hover': { backgroundColor: (t) => t.md3.surfaceBright },
              },
            }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {coverageFallback && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 0.75, color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1.4 }}
        >
          NOAA covers the US only — showing RainViewer.
        </Typography>
      )}
    </Box>
  )
}

/** Static color key for precipitation intensity, matched to the active tile palette. */
function RadarLegend({ rows }: { rows: LegendRow[] }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        zIndex: 1000,
        width: { xs: 128, sm: 150 },
        px: 1.5,
        py: 1,
        ...PANEL_SX,
      }}
    >
      <Stack spacing={1}>
        {rows.map((row) => (
          <Box key={row.label}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                lineHeight: 1.6,
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              {row.label}
            </Typography>
            <Box sx={{ height: 8, borderRadius: 999, backgroundImage: row.gradient }} />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.25 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1 }}>
                Light
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1 }}>
                Heavy
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

type FramePreloader = {
  /** How many frames are mounted/requested so far (loaded sequentially). */
  mountedCount: number
  /** Number of frames whose tiles have finished loading. */
  loadedCount: number
  loaded: Record<string, boolean>
  handleLoad: (index: number, id: string) => void
  handleError: (index: number) => void
}

/**
 * Loads radar frames one at a time instead of all at once. A new frame is only
 * mounted (and its tiles requested) after the previous frame finishes loading
 * or errors, which avoids the request burst that triggers provider throttling.
 */
function useFramePreloader(frames: RadarFrame[]): FramePreloader {
  const frameCount = frames.length
  const [mountedCount, setMountedCount] = useState(0)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMountedCount(frames.length > 0 ? 1 : 0)
    setLoaded({})
  }, [frames])

  const advanceFrom = useCallback(
    (index: number) => {
      setMountedCount((current) => (index >= current - 1 ? Math.min(current + 1, frameCount) : current))
    },
    [frameCount]
  )

  const handleLoad = useCallback(
    (index: number, id: string) => {
      setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
      advanceFrom(index)
    },
    [advanceFrom]
  )

  const handleError = useCallback(
    (index: number) => {
      window.setTimeout(() => advanceFrom(index), ERROR_BACKOFF_MS)
    },
    [advanceFrom]
  )

  const loadedCount = useMemo(() => Object.values(loaded).filter(Boolean).length, [loaded])

  return { mountedCount, loadedCount, loaded, handleLoad, handleError }
}

type RadarFrameLayersProps = {
  frames: RadarFrame[]
  mountedCount: number
  visibleIndex: number
  onLoad: (index: number, id: string) => void
  onError: (index: number) => void
}

/** Renders only the mounted frames, showing the single visible one. */
function RadarFrameLayers({ frames, mountedCount, visibleIndex, onLoad, onError }: RadarFrameLayersProps) {
  return (
    <>
      {frames.slice(0, mountedCount).map((frame, index) => {
        const { render } = frame
        const layerProps = {
          opacity: index === visibleIndex ? RADAR_OPACITY : 0,
          zIndex: 5,
          tileSize: render.tileSize,
          zoomOffset: render.zoomOffset ?? 0,
          bounds: render.bounds,
          // Every mounted frame reloads the viewport whenever the map moves, so
          // requesting tiles for intermediate pan/zoom states multiplies into a
          // burst that providers answer with 429s or dropped HTTP/2 streams.
          updateWhenZooming: false,
          updateWhenIdle: true,
          eventHandlers: {
            load: () => onLoad(index, frame.id),
            tileerror: () => onError(index),
          },
        }

        return render.type === 'wms' ? (
          <WMSTileLayer key={frame.id} url={render.url} params={render.params} {...layerProps} />
        ) : (
          <TileLayer key={frame.id} url={render.url} {...layerProps} />
        )
      })}
    </>
  )
}

export function RadarMap({ latitude, longitude, locationName }: RadarMapProps) {
  const [source, setSource] = useState<RadarSource>('noaa')
  const { frames, loading, error, effectiveSource, coverageFallback } = useRadarFrames(source, latitude, longitude)
  const { mountedCount, loadedCount, loaded, handleLoad, handleError } = useFramePreloader(frames)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  // Only step through frames that have been mounted/loaded so far.
  const playableCount = Math.max(1, mountedCount)

  useEffect(() => {
    setActiveIndex(0)
  }, [frames])

  useEffect(() => {
    if (!playing || loadedCount < MIN_PLAYABLE_FRAMES) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % playableCount)
    }, FRAME_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [playing, loadedCount, playableCount])

  // Show the requested frame once it has loaded; until then hold the nearest
  // loaded frame so playback never blanks out on a still-loading frame.
  const visibleIndex = useMemo(() => {
    if (loaded[frames[activeIndex]?.id]) return activeIndex
    for (let i = activeIndex - 1; i >= 0; i--) {
      if (loaded[frames[i]?.id]) return i
    }
    for (let i = mountedCount - 1; i > activeIndex; i--) {
      if (loaded[frames[i]?.id]) return i
    }
    return activeIndex
  }, [activeIndex, frames, loaded, mountedCount])

  const sliderMax = Math.max(0, playableCount - 1)
  const activeFrame = frames[activeIndex]
  const hasFrames = frames.length > 0

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', backgroundColor: '#03060a' }}
      >
        <TileLayer url={CARTO_DARK_URL} attribution={CARTO_ATTRIBUTION} subdomains="abcd" />
        {hasFrames && (
          <RadarFrameLayers
            frames={frames}
            mountedCount={mountedCount}
            visibleIndex={visibleIndex}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        <CircleMarker
          center={[latitude, longitude]}
          radius={6}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#4aa3ff', fillOpacity: 1 }}
        >
          <Tooltip>{locationName}</Tooltip>
        </CircleMarker>
        <Recenter latitude={latitude} longitude={longitude} zoom={DEFAULT_ZOOM} />
        <RadarAttribution credit={RADAR_ATTRIBUTION[effectiveSource]} />
      </MapContainer>

      <RadarSourceToggle source={source} coverageFallback={coverageFallback} onChange={setSource} />

      {hasFrames && <RadarLegend rows={LEGEND_ROWS[effectiveSource]} />}

      {(loading || error || hasFrames) && (
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            bottom: { xs: 8, sm: 16 },
            zIndex: 1000,
            px: { xs: 1.5, sm: 2 },
            py: 1,
            ...PANEL_SX,
          }}
        >
          {error ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Radar unavailable: {error}
            </Typography>
          ) : loading || !hasFrames ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Loading radar frames…
            </Typography>
          ) : (
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
              <IconButton
                aria-label={playing ? 'Pause radar' : 'Play radar'}
                onClick={() => setPlaying((prev) => !prev)}
                sx={{ color: 'text.primary', flexShrink: 0 }}
              >
                {playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
              </IconButton>

              <Slider
                aria-label="Radar time"
                size="small"
                min={0}
                max={sliderMax}
                value={Math.min(activeIndex, sliderMax)}
                onChange={(_, value) => {
                  setPlaying(false)
                  setActiveIndex(value as number)
                }}
                sx={{ flex: 1 }}
              />

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ flexShrink: 0, minWidth: 96, justifyContent: 'flex-end' }}
              >
                {activeFrame?.isForecast && (
                  <Chip
                    label="Forecast"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: (t) => t.md3.tertiaryContainer,
                      color: (t) => t.md3.onTertiaryContainer,
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {activeFrame ? formatFrameTime(activeFrame.time) : '--:--'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  )
}
