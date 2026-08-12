import SpeedIcon from '@mui/icons-material/Speed'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import type { SvgIconComponent } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { PressureTrend, WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { PressureGauge } from './PressureGauge'

type PressureTileProps = {
  pressure: WeatherStats['pressure']
}

const PRESSURE_TRENDS: Record<PressureTrend, { icon: SvgIconComponent; label: string }> = {
  rising: { icon: TrendingUpIcon, label: 'Rising' },
  falling: { icon: TrendingDownIcon, label: 'Falling' },
  steady: { icon: TrendingFlatIcon, label: 'Steady' },
}

function PressureDetail({ trend }: { trend: PressureTrend }) {
  const { icon: Icon, label } = PRESSURE_TRENDS[trend]
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Icon sx={{ fontSize: 14 }} />
      {label}
    </Box>
  )
}

export function PressureTile({ pressure }: PressureTileProps) {
  return (
    <StatTile icon={SpeedIcon} label="Pressure">
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <PressureGauge pressure={pressure} />
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary', fontWeight: 600, mt: -0.25, textAlign: 'center' }}
        >
          <PressureDetail trend={pressure.trend} />
        </Typography>
      </Box>
    </StatTile>
  )
}
