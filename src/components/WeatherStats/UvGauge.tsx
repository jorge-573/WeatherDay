import { useId } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { uvColors } from '../../theme'
import type { WeatherStats } from '../../types/weather'

const CENTER_X = 70
const BASELINE_Y = 72
const RADIUS = 52
const ARC_LENGTH = Math.PI * RADIUS
const ARC_PATH = `M ${CENTER_X - RADIUS} ${BASELINE_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${BASELINE_Y}`
const MAX_UV = 11

type UvGaugeProps = {
  uv: WeatherStats['uv']
}

function markerColor(value: number) {
  if (value < 3) return uvColors.low
  if (value < 6) return uvColors.moderate
  if (value < 8) return uvColors.high
  if (value < 11) return uvColors.veryHigh
  return uvColors.extreme
}

export function UvGauge({ uv }: UvGaugeProps) {
  const theme = useTheme()
  const gradientId = `uv-${useId().replace(/:/g, '')}`
  const progress = uv.value === null ? 0 : Math.min(Math.max(uv.value / MAX_UV, 0), 1)
  const angle = Math.PI * progress
  const marker = {
    x: CENTER_X - RADIUS * Math.cos(angle),
    y: BASELINE_Y - RADIUS * Math.sin(angle),
  }

  return (
    <Box
      component="svg"
      viewBox="0 0 140 100"
      role="img"
      aria-label={uv.value === null ? 'UV index unavailable' : `UV index ${uv.value}, ${uv.level}`}
      sx={{ display: 'block', width: '100%', maxWidth: 180, mx: 'auto' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={uvColors.low} />
          <stop offset="30%" stopColor={uvColors.moderate} />
          <stop offset="55%" stopColor={uvColors.high} />
          <stop offset="78%" stopColor={uvColors.veryHigh} />
          <stop offset="100%" stopColor={uvColors.extreme} />
        </linearGradient>
      </defs>

      <path d={ARC_PATH} fill="none" stroke={theme.md3.surfaceContainerHighest} strokeWidth={7} strokeLinecap="round" />

      {uv.value !== null && (
        <>
          <path
            d={ARC_PATH}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LENGTH * progress} ${ARC_LENGTH}`}
          />
          <circle
            cx={marker.x}
            cy={marker.y}
            r={5}
            fill={markerColor(uv.value)}
            stroke={theme.md3.surfaceContainer}
            strokeWidth={2.5}
          />
        </>
      )}

      <text
        x={CENTER_X}
        y={61}
        textAnchor="middle"
        fill={theme.palette.text.primary}
        fontFamily={theme.typography.h4.fontFamily}
        fontSize={30}
        fontWeight={700}
      >
        {uv.value ?? '—'}
      </text>
      <text
        x={CENTER_X}
        y={88}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={11}
        fontWeight={600}
      >
        {uv.level}
      </text>
    </Box>
  )
}
