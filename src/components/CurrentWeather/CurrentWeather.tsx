import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import type { CurrentWeatherSnapshot } from '../../types/weather'
import { WeatherIcon } from '../shared/WeatherIcon'

type CurrentWeatherProps = {
  data: CurrentWeatherSnapshot
  temperatureLabel: string
}

export function CurrentWeather({ data, temperatureLabel }: CurrentWeatherProps) {
  const { location, temperature, condition, code, isNight, high, low, feelsLike } = data

  return (
    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
        <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.primary' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {location}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="center">
        <Typography
          component="div"
          sx={{
            fontFamily: (t) => t.typography.h1.fontFamily,
            fontWeight: 700,
            fontSize: 'clamp(4.5rem, 14vw, 8rem)',
            lineHeight: 0.95,
            color: 'text.primary',
          }}
        >
          {temperature}
          <Typography
            component="span"
            sx={{ fontSize: '0.45em', verticalAlign: 'top', ml: 0.25, color: 'text.primary' }}
          >
            {temperatureLabel}
          </Typography>
        </Typography>
        <Box sx={{ pt: 1 }}>
          <WeatherIcon code={code} isNight={isNight} size={56} sx={{ color: 'text.primary' }} />
        </Box>
      </Stack>

      <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'text.primary' }}>
        {condition}
      </Typography>

      <Typography sx={{ mt: 1, color: 'text.primary' }}>
        Feels like {feelsLike}
        {temperatureLabel}
        {' • '}
        High {high}
        {temperatureLabel}
        {' • '}
        Low {low}
        {temperatureLabel}
      </Typography>
    </Box>
  )
}
