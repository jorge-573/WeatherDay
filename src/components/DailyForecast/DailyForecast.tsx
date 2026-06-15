import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { DailyForecastEntry } from '../../types/weather'
import { SectionLabel } from '../shared/SectionLabel'
import { WeatherIcon } from '../shared/WeatherIcon'

type DailyForecastProps = {
  data: DailyForecastEntry[]
  temperatureLabel: string
}

export function DailyForecast({ data, temperatureLabel }: DailyForecastProps) {
  const globalMin = Math.min(...data.map((d) => d.low))
  const globalMax = Math.max(...data.map((d) => d.high))
  const span = Math.max(1, globalMax - globalMin)

  return (
    <Box>
      <SectionLabel>Daily Forecast</SectionLabel>

      <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />} sx={{ mt: 1 }}>
        {data.map((entry, index) => {
          const left = ((entry.low - globalMin) / span) * 100
          const width = ((entry.high - entry.low) / span) * 100
          return (
            <Box
              key={`${entry.day}-${index}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr auto auto', sm: '1.1fr auto 2fr auto' },
                alignItems: 'center',
                gap: 2,
                py: 1.5,
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
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.2, fontSize: '0.65rem' }}
                >
                  {entry.condition}
                </Typography>
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  height: 6,
                  borderRadius: 999,
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
                    borderRadius: 999,
                    background: (t) => `linear-gradient(90deg, ${t.palette.secondary.main}, ${t.md3.accent})`,
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
