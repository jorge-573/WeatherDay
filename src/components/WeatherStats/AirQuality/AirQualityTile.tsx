import BlurOnIcon from '@mui/icons-material/BlurOn'
import type { AirQuality } from '../../../types/weather'
import { StatTile } from '../../shared'
import { AirQualityGauge } from './AirQualityGauge'

type AirQualityTileProps = {
  airQuality: AirQuality | null
}

export function AirQualityTile({ airQuality }: AirQualityTileProps) {
  return (
    <StatTile icon={BlurOnIcon} label="Air Quality">
      <AirQualityGauge airQuality={airQuality} />
    </StatTile>
  )
}
