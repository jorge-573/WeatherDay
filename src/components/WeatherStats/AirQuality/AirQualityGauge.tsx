import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { aqiColors } from '../../../theme'
import type { AirQuality, AqiCategory } from '../../../types/weather'

const MAX_AQI = 500

const AQI_BANDS: { category: AqiCategory; min: number; max: number }[] = [
  { category: 'good', min: 0, max: 50 },
  { category: 'moderate', min: 51, max: 100 },
  { category: 'sensitive', min: 101, max: 150 },
  { category: 'unhealthy', min: 151, max: 200 },
  { category: 'veryUnhealthy', min: 201, max: 300 },
  { category: 'hazardous', min: 301, max: MAX_AQI },
]

type AirQualityGaugeProps = {
  airQuality: AirQuality | null
}

function markerPosition(aqi: number): number {
  const value = Math.min(Math.max(aqi, 0), MAX_AQI)
  const bandIndex = AQI_BANDS.findIndex(({ max }) => value <= max)
  const band = AQI_BANDS[bandIndex]
  const progressWithinBand = (value - band.min) / (band.max - band.min)
  const position = ((bandIndex + Math.max(0, progressWithinBand)) / AQI_BANDS.length) * 100

  return Math.min(Math.max(position, 1.5), 98.5)
}

export function AirQualityGauge({ airQuality }: AirQualityGaugeProps) {
  const markerLeft = airQuality ? markerPosition(airQuality.aqi) : null
  const markerColor = airQuality ? aqiColors[airQuality.category] : undefined
  const ariaLabel = airQuality
    ? `US air quality index ${airQuality.aqi}, ${airQuality.label}${
        airQuality.pm25 === null ? '' : `, PM2.5 ${airQuality.pm25} micrograms per cubic meter`
      }`
    : 'Air quality unavailable'

  return (
    <Stack role="img" aria-label={ariaLabel} justifyContent="center" sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          US AQI
        </Typography>
        <Typography
          variant="h4"
          component="p"
          sx={{ color: markerColor ?? 'text.disabled', fontWeight: 700, lineHeight: 1 }}
        >
          {airQuality?.aqi ?? '—'}
        </Typography>
      </Stack>

      <Box sx={{ position: 'relative', mt: 1.7 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${AQI_BANDS.length}, 1fr)`,
            gap: 0.35,
            height: 6,
          }}
        >
          {AQI_BANDS.map(({ category }) => (
            <Box
              key={category}
              sx={{
                bgcolor: aqiColors[category],
                '&:first-of-type': { borderRadius: '999px 0 0 999px' },
                '&:last-of-type': { borderRadius: '0 999px 999px 0' },
              }}
            />
          ))}
        </Box>

        {markerLeft !== null && (
          <Box
            sx={{
              position: 'absolute',
              left: `${markerLeft}%`,
              top: '50%',
              width: 12,
              height: 12,
              bgcolor: markerColor,
              border: 2,
              borderColor: 'background.paper',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </Box>

      <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mt: 1.1 }}>
        <Typography variant="caption" sx={{ color: markerColor ?? 'text.disabled', fontWeight: 700 }}>
          {airQuality?.label ?? 'No data'}
        </Typography>
        {airQuality?.pm25 !== null && airQuality?.pm25 !== undefined && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            PM2.5 {airQuality.pm25} µg/m³
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
