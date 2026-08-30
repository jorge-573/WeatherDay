import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { radii } from '../../theme'
import type { HourlyForecastEntry } from '../../types/weather'
import { ConditionCaption, PrecipitationBadge, SectionLabel, WeatherIcon } from '../shared'

type HourlyForecastProps = {
  data: HourlyForecastEntry[]
  temperatureLabel: string
}

export function HourlyForecast({ data, temperatureLabel }: HourlyForecastProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <SectionLabel>Hourly Forecast</SectionLabel>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          minWidth: 0,
          width: '100%',
          overflowX: 'auto',
          pb: 1,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: radii.full },
        }}
      >
        {data.map((entry, index) => (
          <Stack
            key={`${entry.hour}-${index}`}
            alignItems="center"
            spacing={1}
            sx={{
              minWidth: 76,
              py: 1.5,
              px: 1,
              borderRadius: 3,
              flexShrink: 0,
              backgroundColor: entry.isNow ? (t) => t.md3.surfaceContainerHigh : 'transparent',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {entry.hour}
            </Typography>
            <WeatherIcon
              code={entry.code}
              isNight={entry.isNight}
              size={26}
              sx={{ color: entry.isNow ? (t) => t.md3.accent : 'text.primary' }}
            />
            <Typography sx={{ fontWeight: 700 }}>
              {entry.temperature}
              {temperatureLabel}
            </Typography>
            <PrecipitationBadge code={entry.code} probability={entry.precipitationProbability} size="sm" reserveSpace />
            <ConditionCaption>{entry.condition}</ConditionCaption>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
