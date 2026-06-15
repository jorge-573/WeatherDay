import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useRadarFrames } from '../../hooks/useRadarFrames'
import { buildRadarTileUrl, type RadarFrame } from '../../services/rainviewer'

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
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> &middot; Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>'

// Light -> heavy stops from RainViewer's official color table for the active
// "Universal Blue" scheme (color 2): rain cyan -> blue -> yellow -> red, snow in
// a separate blue/white palette.
const LEGEND_ROWS = [
  {
    label: 'Rain',
    gradient: 'linear-gradient(to right, #88ddee, #00a3e0, #005588, #ffee00, #ffaa00, #ff4400, #c10000)',
  },
  { label: 'Snow', gradient: 'linear-gradient(to right, #bfffff, #9fdfff, #7fbfff, #4f8fff, #2f6fff, #0f4fff)' },
] as const

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

/** Static color key for precipitation intensity, matched to the active tile palette. */
function RadarLegend() {
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
        borderRadius: 2,
        backgroundColor: 'rgba(6, 10, 16, 0.82)',
        backdropFilter: 'blur(8px)',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1}>
        {LEGEND_ROWS.map((row) => (
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
  handleLoad: (index: number, path: string) => void
  handleError: (index: number) => void
}

/**
 * Loads radar frames one at a time instead of all at once. A new frame is only
 * mounted (and its tiles requested) after the previous frame finishes loading
 * or errors, which avoids the request burst that triggers RainViewer 429s.
 */
function useFramePreloader(frames: RadarFrame[]): FramePreloader {
  const frameCount = frames.length
  const firstPath = frames[0]?.path
  const [mountedCount, setMountedCount] = useState(frameCount > 0 ? 1 : 0)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMountedCount(frameCount > 0 ? 1 : 0)
    setLoaded({})
  }, [firstPath, frameCount])

  const advanceFrom = useCallback(
    (index: number) => {
      setMountedCount((current) => (index >= current - 1 ? Math.min(current + 1, frameCount) : current))
    },
    [frameCount]
  )

  const handleLoad = useCallback(
    (index: number, path: string) => {
      setLoaded((prev) => (prev[path] ? prev : { ...prev, [path]: true }))
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
  host: string
  frames: RadarFrame[]
  mountedCount: number
  visibleIndex: number
  onLoad: (index: number, path: string) => void
  onError: (index: number) => void
}

/** Renders only the mounted frames, showing the single visible one. */
function RadarFrameLayers({ host, frames, mountedCount, visibleIndex, onLoad, onError }: RadarFrameLayersProps) {
  return (
    <>
      {frames.slice(0, mountedCount).map((frame, index) => (
        <TileLayer
          key={frame.path}
          url={buildRadarTileUrl(host, frame)}
          opacity={index === visibleIndex ? RADAR_OPACITY : 0}
          zIndex={5}
          eventHandlers={{
            load: () => onLoad(index, frame.path),
            tileerror: () => onError(index),
          }}
        />
      ))}
    </>
  )
}

export function RadarMap({ latitude, longitude, locationName }: RadarMapProps) {
  const { host, frames, loading, error } = useRadarFrames()
  const { mountedCount, loadedCount, loaded, handleLoad, handleError } = useFramePreloader(frames)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  // Only step through frames that have been mounted/loaded so far.
  const playableCount = Math.max(1, mountedCount)

  useEffect(() => {
    setActiveIndex(0)
  }, [frames.length])

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
    if (loaded[frames[activeIndex]?.path]) return activeIndex
    for (let i = activeIndex - 1; i >= 0; i--) {
      if (loaded[frames[i]?.path]) return i
    }
    for (let i = mountedCount - 1; i > activeIndex; i--) {
      if (loaded[frames[i]?.path]) return i
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
            host={host}
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
      </MapContainer>

      {hasFrames && <RadarLegend />}

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
            borderRadius: 2,
            backgroundColor: 'rgba(6, 10, 16, 0.82)',
            backdropFilter: 'blur(8px)',
            border: 1,
            borderColor: 'divider',
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
                {activeFrame?.kind === 'nowcast' && (
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
