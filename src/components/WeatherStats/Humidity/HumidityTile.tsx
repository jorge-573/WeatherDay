import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { HumidityMeter } from './HumidityMeter'

type HumidityTileProps = {
  humidity: WeatherStats['humidity']
  temperatureLabel: string
}

function humidityComfort(value: number | null): string | null {
  if (value === null) return null
  if (value < 30) return 'Dry'
  if (value <= 60) return 'Comfortable'
  return 'Humid'
}

export function HumidityTile({ humidity, temperatureLabel }: HumidityTileProps) {
  const humidityLabel = humidityComfort(humidity.value)

  return (
    <StatTile icon={WaterDropOutlinedIcon} label="Humidity">
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ flex: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {humidity.value ?? '—'}
            {humidity.value !== null && (
              <Box component="span" sx={{ ml: 0.35, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
                %
              </Box>
            )}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.8, lineHeight: 1.35 }}
          >
            {humidity.dewPoint === null ? 'Dew point unavailable' : `Dew point ${humidity.dewPoint}${temperatureLabel}`}
          </Typography>
          {humidityLabel && (
            <Typography
              variant="caption"
              component="p"
              sx={{ color: (t) => t.md3.accent, fontWeight: 700, mt: 0.35, lineHeight: 1.35 }}
            >
              {humidityLabel}
            </Typography>
          )}
        </Box>
        <HumidityMeter value={humidity.value} />
      </Stack>
    </StatTile>
  )
}
