import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { CurrentWeather } from '../../components/CurrentWeather'
import { DailyForecast } from '../../components/DailyForecast'
import { HourlyForecast } from '../../components/HourlyForecast'
import { useLayoutContext } from '../../components/Layout'
import { StatusMessage } from '../../components/shared'
import { WeatherAlert } from '../../components/WeatherAlert'
import { WeatherStats } from '../../components/WeatherStats'
import { UNIT_CONFIG } from '../../config/units'

export function Home() {
  const { data, loading, error, units, cityLocation } = useLayoutContext()
  const temperatureLabel = UNIT_CONFIG[units].temperatureLabel

  if (!data) {
    return (
      <StatusMessage>
        {loading
          ? 'Loading weather…'
          : error
            ? `Could not load weather: ${error}`
            : 'Search for a city to see the forecast.'}
      </StatusMessage>
    )
  }

  return (
    <>
      {data.alerts.length > 0 && (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <WeatherAlert alerts={data.alerts} />
        </Box>
      )}

      <Stack spacing={{ xs: 3, md: 4 }}>
        <CurrentWeather
          data={data.current}
          temperatureLabel={temperatureLabel}
          isCurrentLocation={cityLocation.isCurrentLocation}
        />
        <HourlyForecast data={data.hourly} temperatureLabel={temperatureLabel} />
        <Divider />
        <DailyForecast data={data.daily} temperatureLabel={temperatureLabel} />
        <WeatherStats
          data={data.stats}
          hourly={data.hourly}
          airQuality={data.airQuality}
          temperatureLabel={temperatureLabel}
        />
      </Stack>
    </>
  )
}
