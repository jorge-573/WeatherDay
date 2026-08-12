import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import type { WeatherStats } from '../../../types/weather'
import { StatTile } from '../../shared'
import { SunArc } from './SunArc'
import { sunCountdown } from './sunCountdown'

type SunTileProps = {
  sun: WeatherStats['sun']
}

function sunDetail(sun: WeatherStats['sun']): string | null {
  const countdown = sunCountdown(sun)
  const sunshine = sun.sunshine ? `${sun.sunshine} of sun` : null
  return [countdown, sunshine].filter(Boolean).join(' · ') || null
}

export function SunTile({ sun }: SunTileProps) {
  return (
    <StatTile icon={WbTwilightIcon} label="Sun" detail={sunDetail(sun)}>
      <SunArc sun={sun} />
    </StatTile>
  )
}
