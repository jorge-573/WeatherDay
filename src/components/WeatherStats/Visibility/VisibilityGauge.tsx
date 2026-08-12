import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { WeatherStats } from '../../../types/weather'
import { VisibilityScene } from './VisibilityScene'
import { getVisibilityStatus } from './visibilityScale'

type VisibilityGaugeProps = {
  visibility: WeatherStats['visibility']
}

export function VisibilityGauge({ visibility }: VisibilityGaugeProps) {
  const numericValue = visibility.value === null ? null : Number(visibility.value)
  const status = getVisibilityStatus(numericValue, visibility.unit)

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      role="img"
      aria-label={
        numericValue === null
          ? 'Visibility unavailable'
          : `Visibility ${visibility.value} ${visibility.unit}, ${status.label}`
      }
      sx={{ flex: 1 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {visibility.value ?? '—'}
          {visibility.value !== null && (
            <Box component="span" sx={{ ml: 0.4, fontSize: '0.45em', fontWeight: 600, color: 'text.secondary' }}>
              {visibility.unit}
            </Box>
          )}
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={{ color: (t) => t.md3.accent, fontWeight: 700, mt: 0.8, lineHeight: 1.35 }}
        >
          {status.label}
        </Typography>
      </Box>

      <VisibilityScene clarity={status.clarity} />
    </Stack>
  )
}
