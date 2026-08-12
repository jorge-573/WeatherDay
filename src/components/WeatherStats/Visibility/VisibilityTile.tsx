import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import type { WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { VisibilityGauge } from './VisibilityGauge'

type VisibilityTileProps = {
  visibility: WeatherStats['visibility']
}

export function VisibilityTile({ visibility }: VisibilityTileProps) {
  return (
    <StatTile icon={VisibilityOutlinedIcon} label="Visibility">
      <VisibilityGauge visibility={visibility} />
    </StatTile>
  )
}
