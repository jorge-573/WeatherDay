import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import type { RadarFrame } from '../../types/radar'
import { StatusMessage } from '../shared'
import { OVERLAY_Z_INDEX, PANEL_SX } from './panel'

type RadarTimelineProps = {
  loading: boolean
  error: string | null
  /** The frame being shown, absent until the first one arrives. */
  frame: RadarFrame | undefined
  activeIndex: number
  maxIndex: number
  playing: boolean
  onTogglePlay: () => void
  onScrub: (index: number) => void
}

function formatFrameTime(time: number): string {
  return new Date(time * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Playback controls and the timestamp of the frame on screen. */
export function RadarTimeline({
  loading,
  error,
  frame,
  activeIndex,
  maxIndex,
  playing,
  onTogglePlay,
  onScrub,
}: RadarTimelineProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        bottom: { xs: 8, sm: 16 },
        zIndex: OVERLAY_Z_INDEX,
        px: { xs: 1.5, sm: 2 },
        py: 1,
        ...PANEL_SX,
      }}
    >
      {error ? (
        <StatusMessage inline>{`Radar unavailable: ${error}`}</StatusMessage>
      ) : loading || !frame ? (
        <StatusMessage inline>Loading radar frames…</StatusMessage>
      ) : (
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
          <IconButton
            aria-label={playing ? 'Pause radar' : 'Play radar'}
            onClick={onTogglePlay}
            sx={{ color: 'text.primary', flexShrink: 0 }}
          >
            {playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>

          <Slider
            aria-label="Radar time"
            size="small"
            min={0}
            max={maxIndex}
            value={activeIndex}
            onChange={(_, value) => onScrub(value as number)}
            sx={{ flex: 1 }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0, minWidth: 96, justifyContent: 'flex-end' }}
          >
            {frame.isForecast && (
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
              {formatFrameTime(frame.time)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  )
}
