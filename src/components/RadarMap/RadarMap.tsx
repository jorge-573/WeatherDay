import { useEffect, useState } from 'react'
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

const FRAME_INTERVAL_MS = 600
const DEFAULT_ZOOM = 7
const RADAR_OPACITY = 0.7

const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> &middot; Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>'

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

/** Renders every frame as a layer; only the active one is visible so frames preload and swap without flicker. */
function RadarFrameLayers({ host, frames, activeIndex }: { host: string; frames: RadarFrame[]; activeIndex: number }) {
  return (
    <>
      {frames.map((frame, index) => (
        <TileLayer
          key={frame.path}
          url={buildRadarTileUrl(host, frame)}
          opacity={index === activeIndex ? RADAR_OPACITY : 0}
          zIndex={5}
        />
      ))}
    </>
  )
}

export function RadarMap({ latitude, longitude, locationName }: RadarMapProps) {
  const { host, frames, loading, error } = useRadarFrames()
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    setActiveIndex(0)
  }, [frames.length])

  useEffect(() => {
    if (!playing || frames.length <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frames.length)
    }, FRAME_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [playing, frames.length])

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
        {hasFrames && <RadarFrameLayers host={host} frames={frames} activeIndex={activeIndex} />}
        <CircleMarker
          center={[latitude, longitude]}
          radius={6}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#4aa3ff', fillOpacity: 1 }}
        >
          <Tooltip>{locationName}</Tooltip>
        </CircleMarker>
        <Recenter latitude={latitude} longitude={longitude} zoom={DEFAULT_ZOOM} />
      </MapContainer>

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
                max={frames.length - 1}
                value={activeIndex}
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
