import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import type { CurrentWeatherSnapshot } from '../../types/weather'

type CurrentWeatherProps = {
  data: CurrentWeatherSnapshot
  temperatureLabel: string
}

export function CurrentWeather({ data, temperatureLabel }: CurrentWeatherProps) {
  const { location, temperature, condition, high, low, feelsLike } = data

  return (
    <Box>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mb: 1 }}>
        <LocationOnOutlinedIcon fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {location}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={3} alignItems="flex-start" flexWrap="wrap">
        <Typography
          component="div"
          sx={{
            fontFamily: (t) => t.typography.h1.fontFamily,
            fontWeight: 700,
            fontSize: 'clamp(4rem, 11vw, 7rem)',
            lineHeight: 0.95,
          }}
        >
          {temperature}
          <Typography component="span" sx={{ fontSize: '0.4em', verticalAlign: 'top', ml: 0.5, color: 'primary.main' }}>
            {temperatureLabel}
          </Typography>
        </Typography>

        <Box sx={{ pt: { xs: 0, sm: 2 } }}>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {condition}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Feels like {feelsLike}
            {temperatureLabel}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Chip
          size="small"
          icon={<ArrowUpwardIcon sx={{ fontSize: '1rem !important' }} />}
          label={`H: ${high}${temperatureLabel}`}
          sx={{ bgcolor: (t) => t.md3.surfaceContainerHigh, color: 'text.primary' }}
        />
        <Chip
          size="small"
          icon={<ArrowDownwardIcon sx={{ fontSize: '1rem !important' }} />}
          label={`L: ${low}${temperatureLabel}`}
          sx={{ bgcolor: (t) => t.md3.surfaceContainerHigh, color: 'text.primary' }}
        />
      </Stack>
    </Box>
  )
}
