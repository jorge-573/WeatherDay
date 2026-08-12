import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { WeatherStats } from '../../../types/weather'
import { StatTile, StatValue } from '../../shared'
import { VisibilityGauge } from './VisibilityGauge'
import { getVisibilityStatus } from './visibilityScale'

type VisibilityTileProps = {
  visibility: WeatherStats['visibility']
}

export function VisibilityTile({ visibility }: VisibilityTileProps) {
  const numericValue = visibility.value === null ? null : Number(visibility.value)
  const status = getVisibilityStatus(numericValue, visibility.unit)

  return (
    <StatTile icon={VisibilityOutlinedIcon} label="Visibility">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={{ xs: 0.5, sm: 1 }}
        role="img"
        aria-label={
          numericValue === null
            ? 'Visibility unavailable'
            : `Visibility ${visibility.value} ${visibility.unit}, ${status.label}`
        }
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <StatValue value={visibility.value} unit={visibility.unit} />
          <Typography
            variant="caption"
            component="p"
            sx={{ color: (t) => t.md3.accent, fontWeight: 700, mt: 0.8, lineHeight: 1.35 }}
          >
            {status.label}
          </Typography>
        </Box>

        <VisibilityGauge clarity={status.clarity} />
      </Stack>
    </StatTile>
  )
}
