import { useId } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { SunPhase, SunStat } from '../../types/weather'
import { sunCountdown } from './sunCountdown'

// A semicircle sitting on the horizon line: the sun enters at the left end
// (sunrise), peaks at the top, and exits at the right (sunset).
const CENTER_X = 100
const HORIZON_Y = 92
const RADIUS = 78
const ARC_PATH = `M ${CENTER_X - RADIUS} ${HORIZON_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${HORIZON_Y}`
const ARC_LENGTH = Math.PI * RADIUS

// Where the sun rests while it is down, just outside whichever end it is nearest.
const BELOW_HORIZON: Record<Exclude<SunPhase, 'daylight'>, { x: number; y: number }> = {
  beforeSunrise: { x: 14, y: 100 },
  afterSunset: { x: 186, y: 100 },
}

function sunPosition(phase: SunPhase, progress: number): { x: number; y: number } {
  if (phase !== 'daylight') return BELOW_HORIZON[phase]
  const theta = Math.PI * progress
  return { x: CENTER_X - RADIUS * Math.cos(theta), y: HORIZON_Y - RADIUS * Math.sin(theta) }
}

function describe(sun: SunStat, hasTimes: boolean): string {
  if (!hasTimes) return 'Sun position unavailable for this location'
  const countdown = sunCountdown(sun)
  const times = `Sunrise ${sun.sunrise}, sunset ${sun.sunset}`
  return countdown ? `${countdown}. ${times}` : times
}

type SunArcProps = {
  sun: SunStat
}

export function SunArc({ sun }: SunArcProps) {
  const theme = useTheme()
  // Colons in React's generated ids would land inside a url(#...) reference.
  const gradientId = `sunArc-${useId().replace(/:/g, '')}`

  // Empty clock strings mean the provider gave no sun events (polar day or night),
  // so there is no meaningful position to mark.
  const hasTimes = Boolean(sun.sunrise && sun.sunset)
  const marker = hasTimes ? sunPosition(sun.phase, sun.progress) : null
  const isDown = sun.phase !== 'daylight'

  return (
    <Box>
      <Box
        component="svg"
        viewBox="0 0 200 114"
        role="img"
        aria-label={describe(sun, hasTimes)}
        sx={{ display: 'block', width: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={theme.md3.secondary} />
            <stop offset="100%" stopColor={theme.md3.accent} />
          </linearGradient>
        </defs>

        <path
          d={ARC_PATH}
          fill="none"
          stroke={theme.md3.surfaceContainerHighest}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="0.5 12"
        />

        {/* Only daylight has a meaningful sweep; at night the arc stays empty. */}
        {sun.phase === 'daylight' && (
          <path
            d={ARC_PATH}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LENGTH * sun.progress} ${ARC_LENGTH}`}
          />
        )}

        <line
          x1={8}
          y1={HORIZON_Y}
          x2={192}
          y2={HORIZON_Y}
          stroke={theme.md3.outlineVariant}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {marker && (
          <circle cx={marker.x} cy={marker.y} r={7} fill={isDown ? theme.md3.outline : theme.md3.tertiaryFixedDim} />
        )}

        {sun.daylight && (
          <>
            <text
              x={CENTER_X}
              y={60}
              textAnchor="middle"
              fill={theme.palette.text.primary}
              fontFamily={theme.typography.h4.fontFamily}
              fontSize={17}
              fontWeight={700}
            >
              {sun.daylight}
            </text>
            <text
              x={CENTER_X}
              y={74}
              textAnchor="middle"
              fill={theme.palette.text.secondary}
              fontFamily={theme.typography.fontFamily}
              fontSize={9}
              fontWeight={700}
              letterSpacing={1}
            >
              DAYLIGHT
            </text>
          </>
        )}
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {sun.sunrise || '—'}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {sun.sunset || '—'}
        </Typography>
      </Stack>
    </Box>
  )
}
