import Box from '@mui/material/Box'
import type { AirQuality, HourlyForecastEntry, WeatherStats as WeatherStatsData } from '../../types/weather'
import { SectionLabel } from '../shared'
import { AirQualityTile } from './AirQuality/AirQualityTile'
import { HumidityTile } from './Humidity/HumidityTile'
import { PrecipitationTile } from './Precipitation/PrecipitationTile'
import { PressureTile } from './Pressure/PressureTile'
import { SunTile } from './Sun/SunTile'
import { UvTile } from './Uv/UvTile'
import { VisibilityTile } from './Visibility/VisibilityTile'
import { WindTile } from './Wind/WindTile'

type WeatherStatsProps = {
  data: WeatherStatsData
  hourly: HourlyForecastEntry[]
  airQuality: AirQuality | null
  temperatureLabel: string
}

export function WeatherStats({ data, hourly, airQuality, temperatureLabel }: WeatherStatsProps) {
  const { sun, wind, uv, humidity, precipitation, pressure, visibility } = data

  return (
    <Box>
      <SectionLabel>Conditions</SectionLabel>
      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <SunTile sun={sun} />
        <WindTile wind={wind} />
        <UvTile uv={uv} />
        <HumidityTile humidity={humidity} temperatureLabel={temperatureLabel} />
        <PrecipitationTile precipitation={precipitation} hourly={hourly} />
        <PressureTile pressure={pressure} />
        <VisibilityTile visibility={visibility} />
        <AirQualityTile airQuality={airQuality} />
      </Box>
    </Box>
  )
}
