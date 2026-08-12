import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import type { WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { UvGauge } from './UvGauge'

type UvTileProps = {
  uv: WeatherStats['uv']
}

export function UvTile({ uv }: UvTileProps) {
  return (
    <StatTile icon={WbSunnyOutlinedIcon} label="UV Index">
      <UvGauge uv={uv} />
    </StatTile>
  )
}
