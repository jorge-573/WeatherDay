import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { WeatherStats } from '../../../types/weather'

const CENTER_X = 55
const CENTER_Y = 48
const RADIUS = 34
const RING_STROKE = 9
const POINTER_LENGTH = 5
const START_ANGLE = 135
const SWEEP_ANGLE = 270
const ARC_LENGTH = (SWEEP_ANGLE / 360) * 2 * Math.PI * RADIUS
const ARC_PATH = 'M 31 72 A 34 34 0 1 1 79 72'

type PressureGaugeProps = {
  pressure: WeatherStats['pressure']
}

function pressureRange(unit: string) {
  return unit === 'inHg' ? { low: 28.5, high: 31 } : { low: 965, high: 1050 }
}

export function PressureGauge({ pressure }: PressureGaugeProps) {
  const theme = useTheme()
  const numericValue = pressure.value === null ? null : Number(pressure.value)
  const range = pressureRange(pressure.unit)
  const progress =
    numericValue === null || Number.isNaN(numericValue)
      ? 0
      : Math.min(Math.max((numericValue - range.low) / (range.high - range.low), 0), 1)
  const markerAngleDegrees = START_ANGLE + SWEEP_ANGLE * progress
  const markerAngle = (markerAngleDegrees * Math.PI) / 180
  // Keep the pointer entirely inside the hollow area. Its tip stops one unit
  // before the ring's inner edge instead of cutting through the gauge stroke.
  const markerRadius = RADIUS - RING_STROKE / 2 - POINTER_LENGTH - 1
  const marker = {
    x: CENTER_X + markerRadius * Math.cos(markerAngle),
    y: CENTER_Y + markerRadius * Math.sin(markerAngle),
  }

  return (
    <Box
      component="svg"
      viewBox="0 0 110 96"
      role="img"
      aria-label={
        pressure.value === null
          ? 'Pressure unavailable'
          : `Pressure ${pressure.value} ${pressure.unit}, ${pressure.trend}`
      }
      sx={{ display: 'block', width: 102, height: 90, flexShrink: 0 }}
    >
      <path
        d={ARC_PATH}
        fill="none"
        stroke={theme.md3.surfaceContainerHighest}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
      />

      {numericValue !== null && !Number.isNaN(numericValue) && (
        <>
          <path
            d={ARC_PATH}
            fill="none"
            stroke={theme.md3.accent}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LENGTH * progress} ${ARC_LENGTH}`}
          />
          <path
            d="M 5 0 L -3.5 -4 L -3.5 4 Z"
            fill={theme.palette.text.primary}
            strokeLinejoin="round"
            transform={`translate(${marker.x} ${marker.y}) rotate(${markerAngleDegrees})`}
          />
        </>
      )}

      <text
        x={25}
        y={91}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={9}
        fontWeight={600}
      >
        Low
      </text>
      <text
        x={85}
        y={91}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={9}
        fontWeight={600}
      >
        High
      </text>
    </Box>
  )
}
