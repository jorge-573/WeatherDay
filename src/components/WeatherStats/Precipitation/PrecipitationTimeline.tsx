import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { HourlyForecastEntry } from '../../../types/weather'

const HOURS_SHOWN = 12
const CHART_WIDTH = 144
const CHART_BOTTOM = 42
const MAX_BAR_HEIGHT = 34
const BAR_STEP = CHART_WIDTH / HOURS_SHOWN
const BAR_WIDTH = 7

type PrecipitationTimelineProps = {
  data: HourlyForecastEntry[]
}

export function PrecipitationTimeline({ data }: PrecipitationTimelineProps) {
  const theme = useTheme()
  const hours = data.slice(0, HOURS_SHOWN)
  const forecastUnavailable = hours.every((entry) => entry.precipitationProbability === null)
  const highest = hours.reduce<HourlyForecastEntry | null>((best, entry) => {
    if (entry.precipitationProbability === null) return best
    if (!best || entry.precipitationProbability > (best.precipitationProbability ?? 0)) return entry
    return best
  }, null)
  const highestChance = highest?.precipitationProbability ?? 0
  const summary = forecastUnavailable
    ? 'Forecast unavailable'
    : highestChance === 0
      ? 'No rain expected'
      : `Highest ${highestChance}% ${highest?.isNow ? 'now' : `at ${highest?.hour}`}`

  return (
    <Box sx={{ mt: 0.75 }}>
      <Typography variant="caption" sx={{ color: (t) => t.md3.accent, fontWeight: 700 }}>
        {summary}
      </Typography>
      <Box
        component="svg"
        viewBox="0 0 144 56"
        role="img"
        aria-label={`Next 12 hours precipitation. ${summary}.`}
        sx={{ display: 'block', width: '100%', mt: 0.25 }}
      >
        {hours.map((entry, index) => {
          const probability = entry.precipitationProbability ?? 0
          const height = Math.max(probability > 0 ? 3 : 1.5, (probability / 100) * MAX_BAR_HEIGHT)
          const x = index * BAR_STEP + (BAR_STEP - BAR_WIDTH) / 2
          const y = CHART_BOTTOM - height

          return (
            <g key={`${entry.hour}-${index}`}>
              <rect
                x={x}
                y={CHART_BOTTOM - MAX_BAR_HEIGHT}
                width={BAR_WIDTH}
                height={MAX_BAR_HEIGHT}
                rx={BAR_WIDTH / 2}
                fill={theme.md3.surfaceContainerHighest}
              />
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={height}
                rx={BAR_WIDTH / 2}
                fill={theme.md3.accent}
                opacity={probability === 0 ? 0.2 : 0.55 + probability / 225}
              />
            </g>
          )
        })}

        <text
          x={2}
          y={54}
          fill={theme.palette.text.secondary}
          fontFamily={theme.typography.fontFamily}
          fontSize={8}
          fontWeight={600}
        >
          Now
        </text>
        <text
          x={142}
          y={54}
          textAnchor="end"
          fill={theme.palette.text.secondary}
          fontFamily={theme.typography.fontFamily}
          fontSize={8}
          fontWeight={600}
        >
          {hours[hours.length - 1]?.hour ?? '+12 h'}
        </text>
      </Box>
    </Box>
  )
}
