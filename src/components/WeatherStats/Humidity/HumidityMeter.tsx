import { useId } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

const METER_X = 27
const METER_Y = 20
const METER_WIDTH = 28
const METER_HEIGHT = 84
const LABEL_X = METER_X + METER_WIDTH / 2

type HumidityMeterProps = {
  value: number | null
}

export function HumidityMeter({ value }: HumidityMeterProps) {
  const theme = useTheme()
  const clipId = `humidity-meter-${useId().replace(/:/g, '')}`
  const humidity = value === null ? 0 : Math.min(Math.max(value, 0), 100)
  const fillHeight = (humidity / 100) * METER_HEIGHT
  const fillY = METER_Y + METER_HEIGHT - fillHeight

  return (
    <Box
      component="svg"
      viewBox="0 0 82 124"
      role="img"
      aria-label={value === null ? 'Humidity unavailable' : `Humidity ${value} percent`}
      sx={{
        display: 'block',
        width: { xs: 70, sm: 80 },
        height: { xs: 106, sm: 118 },
        flexShrink: 0,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={METER_X} y={METER_Y} width={METER_WIDTH} height={METER_HEIGHT} rx={METER_WIDTH / 2} />
        </clipPath>
      </defs>

      <text
        x={LABEL_X}
        y={11}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={9}
        fontWeight={700}
      >
        100
      </text>

      <rect
        x={METER_X}
        y={METER_Y}
        width={METER_WIDTH}
        height={METER_HEIGHT}
        rx={METER_WIDTH / 2}
        fill={theme.md3.surfaceContainerHighest}
        stroke={theme.md3.outlineVariant}
        strokeWidth={1.5}
      />

      {value !== null && (
        <>
          <rect
            x={METER_X}
            y={fillY}
            width={METER_WIDTH}
            height={fillHeight}
            fill={theme.md3.tertiaryFixedDim}
            clipPath={`url(#${clipId})`}
          />
          <path
            d={`M ${METER_X - 2} ${fillY} L ${METER_X - 6} ${fillY - 3.5} L ${METER_X - 6} ${fillY + 3.5} Z`}
            fill={theme.palette.text.primary}
          />
        </>
      )}

      <text
        x={LABEL_X}
        y={120}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={9}
        fontWeight={700}
      >
        0
      </text>
    </Box>
  )
}
