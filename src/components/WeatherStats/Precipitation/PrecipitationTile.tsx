import UmbrellaIcon from '@mui/icons-material/Umbrella'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { HourlyForecastEntry, WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { PrecipitationTimeline } from './PrecipitationTimeline'

type PrecipitationTileProps = {
  precipitation: WeatherStats['precipitation']
  hourly: HourlyForecastEntry[]
}

function precipitationDetail(hours: number | null): string | null {
  if (hours === null) return null
  return hours === 0 ? 'Dry all day' : `${hours} h with precipitation`
}

export function PrecipitationTile({ precipitation, hourly }: PrecipitationTileProps) {
  return (
    <StatTile icon={UmbrellaIcon} label="Precipitation">
      <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
        {precipitation.total ?? '—'}
        {precipitation.total !== null && (
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
            {precipitation.unit}
          </Box>
        )}
      </Typography>
      <Typography
        variant="caption"
        component="p"
        sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.6, lineHeight: 1.35 }}
      >
        {precipitationDetail(precipitation.hours)}
      </Typography>
      <PrecipitationTimeline data={hourly} />
    </StatTile>
  )
}
