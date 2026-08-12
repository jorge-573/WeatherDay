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
                  xs: 'minmax(44px, 0.8fr) minmax(64px, 1fr) auto minmax(48px, 1.3fr) auto',
                  sm: 'minmax(0, 1.1fr) auto auto minmax(0, 2fr) auto',
                },
                gridTemplateAreas: {
                  xs: '"day weather low bar high"',
                  sm: '"day weather low bar high"',
                },
                alignItems: 'center',
                columnGap: { xs: 0.75, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                minWidth: 0,
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 0, sm: 1 }}
                alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                sx={{ gridArea: 'day', minWidth: 0, justifySelf: 'start' }}
              >
                <Typography sx={{ fontWeight: 600 }}>{entry.day}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {entry.date}
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: 'row', sm: 'column' }}
                alignItems="center"
                spacing={{ xs: 0.5, sm: 0.25 }}
                sx={{
                  gridArea: 'weather',
                  width: { xs: '100%', sm: 88 },
                  minWidth: 0,
                  justifySelf: 'center',
                }}
              >
                <WeatherIcon code={entry.code} size={24} sx={{ color: 'text.primary' }} />
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ display: { xs: 'flex', sm: 'none' }, minWidth: 0 }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      overflow: 'hidden',
                      '& .MuiTypography-root': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <ConditionCaption>{entry.condition}</ConditionCaption>
                  </Box>
                  <PrecipitationBadge code={entry.code} probability={entry.precipitationProbability} size="sm" />
                </Stack>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ConditionCaption>{entry.condition}</ConditionCaption>
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <PrecipitationBadge code={entry.code} probability={entry.precipitationProbability} />
                </Box>
              </Stack>
              <Typography sx={{ gridArea: 'low', color: 'text.secondary' }}>
                {entry.low}
                {temperatureLabel}
              </Typography>
              <Box
                sx={{
                  gridArea: 'bar',
                  position: 'relative',
                  height: 6,
                  borderRadius: radii.full,
                  backgroundColor: (t) => t.md3.surfaceContainerHigh,
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
              <Typography sx={{ gridArea: 'high', fontWeight: 700, justifySelf: 'center' }}>
                {entry.high}
                {temperatureLabel}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
