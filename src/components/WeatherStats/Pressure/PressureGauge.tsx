import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { WeatherStats } from '../../../types/weather'

const CENTER_X = 55
const CENTER_Y = 48
const RADIUS = 34
const RING_STROKE = 9
const START_ANGLE = 135
const SWEEP_ANGLE = 270
const ARC_LENGTH = (SWEEP_ANGLE / 360) * 2 * Math.PI * RADIUS

function pointOnCircle(angleDegrees: number) {
  const angleRadians = (angleDegrees * Math.PI) / 180
  return {
    x: Math.round(CENTER_X + RADIUS * Math.cos(angleRadians)),
    y: Math.round(CENTER_Y + RADIUS * Math.sin(angleRadians)),
  }
}

const arcStart = pointOnCircle(START_ANGLE)
const arcEnd = pointOnCircle(START_ANGLE + SWEEP_ANGLE)
const ARC_PATH = `M ${arcStart.x} ${arcStart.y} A ${RADIUS} ${RADIUS} 0 ${SWEEP_ANGLE > 180 ? 1 : 0} 1 ${arcEnd.x} ${arcEnd.y}`

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
      sx={{
        display: 'block',
        width: '100%',
        height: 'auto',
        maxWidth: 180,
        mx: 'auto',
      }}
    >
      <path
        d={ARC_PATH}
        fill="none"
        stroke={theme.md3.surfaceContainerHighest}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
      />

      {numericValue !== null && !Number.isNaN(numericValue) && (
        <path
          d={ARC_PATH}
          fill="none"
          stroke={theme.md3.accent}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${ARC_LENGTH * progress} ${ARC_LENGTH}`}
        />
      )}

      <text
        x={CENTER_X}
        y={50}
        textAnchor="middle"
        fill={
          numericValue === null || Number.isNaN(numericValue) ? theme.palette.text.disabled : theme.palette.text.primary
        }
        fontFamily={theme.typography.h4.fontFamily}
        fontSize={18}
        fontWeight={700}
      >
        {pressure.value ?? '—'}
      </text>
      {pressure.value !== null && (
        <text
          x={CENTER_X}
          y={62}
          textAnchor="middle"
          fill={theme.palette.text.secondary}
          fontFamily={theme.typography.fontFamily}
          fontSize={8}
          fontWeight={600}
        >
          {pressure.unit}
        </text>
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
