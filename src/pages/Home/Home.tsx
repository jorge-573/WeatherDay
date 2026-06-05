import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CurrentWeather } from '../../components/CurrentWeather'
import { DailyForecast } from '../../components/DailyForecast'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { HourlyForecast } from '../../components/HourlyForecast'
import { WeatherAlert } from '../../components/WeatherAlert'
import { WeatherStats } from '../../components/WeatherStats'
import { UNIT_CONFIG, type UnitSystem } from '../../config/units'
import type { useCityLocation } from '../../hooks/useCityLocation'
import type { WeatherData } from '../../hooks/useWeather'

type HomeProps = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  units: UnitSystem
  cityLocation: ReturnType<typeof useCityLocation>
  onUnitChange: (units: UnitSystem) => void
}

export function Home({ data, loading, error, units, cityLocation, onUnitChange }: HomeProps) {
  const temperatureLabel = UNIT_CONFIG[units].temperatureLabel

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header units={units} cityLocation={cityLocation} onUnitChange={onUnitChange} />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1080,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <WeatherAlert
            title="Severe Thunderstorm Warning"
            detail="Until 8:00 PM • Flash flood risk in coastal areas."
          />
        </Box>

        {data ? (
          <Stack spacing={{ xs: 3, md: 4 }}>
            <CurrentWeather
              data={data.current}
              temperatureLabel={temperatureLabel}
              isCurrentLocation={cityLocation.isCurrentLocation}
            />
            <HourlyForecast data={data.hourly} temperatureLabel={temperatureLabel} />
            <Divider />
            <DailyForecast data={data.daily} temperatureLabel={temperatureLabel} />
            <WeatherStats data={data.stats} />
          </Stack>
        ) : (
          <Typography sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
            {loading
              ? 'Loading weather…'
              : error
                ? `Could not load weather: ${error}`
                : 'Search for a city to see the forecast.'}
          </Typography>
        )}
      </Box>

      <Footer />
    </Box>
  )
}
