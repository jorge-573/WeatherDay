import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { gradients, radii } from '../../theme'
import type { DailyForecastEntry } from '../../types/weather'
import { ConditionCaption, PrecipitationBadge, SectionLabel, WeatherIcon } from '../shared'

type DailyForecastProps = {
  data: DailyForecastEntry[]
  temperatureLabel: string
}

export function DailyForecast({ data, temperatureLabel }: DailyForecastProps) {
  const globalMin = Math.min(...data.map((d) => d.low))
  const globalMax = Math.max(...data.map((d) => d.high))
  const span = Math.max(1, globalMax - globalMin)

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <SectionLabel>10-Day Forecast</SectionLabel>

      <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />} sx={{ mt: 1 }}>
        {data.map((entry, index) => {
          const left = ((entry.low - globalMin) / span) * 100
          const width = ((entry.high - entry.low) / span) * 100
          return (
            <Box
              key={`${entry.day}-${index}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr) auto auto',
                  sm: 'minmax(0, 1.1fr) auto minmax(0, 2fr) auto',
                },
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                minWidth: 0,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography sx={{ fontWeight: 600 }}>{entry.day}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {entry.date}
                </Typography>
              </Stack>
              <Stack alignItems="center" spacing={0.25} sx={{ width: 88 }}>
                <WeatherIcon code={entry.code} size={24} sx={{ color: 'text.primary' }} />
                <ConditionCaption>{entry.condition}</ConditionCaption>
                <PrecipitationBadge code={entry.code} probability={entry.precipitationProbability} />
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  height: 6,
                  borderRadius: radii.full,
                  backgroundColor: (t) => t.md3.surfaceContainerHigh,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${left}%`,
                    width: `${Math.max(width, 6)}%`,
                    borderRadius: radii.full,
                    background: gradients.accentBar,
                  }}
                />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Typography sx={{ fontWeight: 700 }}>
                  {entry.high}
                  {temperatureLabel}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {entry.low}
                  {temperatureLabel}
                </Typography>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
