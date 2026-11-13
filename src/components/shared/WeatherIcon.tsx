import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { MaterialSymbolsComponent } from '@material-symbols-svg/react/rounded'
import { Bedtime } from '@material-symbols-svg/react/rounded/icons/bedtime'
import { Cloud } from '@material-symbols-svg/react/rounded/icons/cloud'
import { Foggy } from '@material-symbols-svg/react/rounded/icons/foggy'
import { PartlyCloudyDay } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-day'
import { PartlyCloudyNight } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-night'
import { Rainy } from '@material-symbols-svg/react/rounded/icons/rainy'
import { RainyHeavy } from '@material-symbols-svg/react/rounded/icons/rainy-heavy'
import { RainyLight } from '@material-symbols-svg/react/rounded/icons/rainy-light'
import { Snowing } from '@material-symbols-svg/react/rounded/icons/snowing'
import { SnowingHeavy } from '@material-symbols-svg/react/rounded/icons/snowing-heavy'
import { Sunny } from '@material-symbols-svg/react/rounded/icons/sunny'
import { Thunderstorm } from '@material-symbols-svg/react/rounded/icons/thunderstorm'
import { WeatherSnowy } from '@material-symbols-svg/react/rounded/icons/weather-snowy'
import { getWeatherIcon, type WeatherIconName } from './weatherIcons'

const ICON_COMPONENTS: Record<WeatherIconName, MaterialSymbolsComponent> = {
  sunny: Sunny,
  bedtime: Bedtime,
  partlyCloudyDay: PartlyCloudyDay,
  partlyCloudyNight: PartlyCloudyNight,
  cloud: Cloud,
  foggy: Foggy,
  rainyLight: RainyLight,
  rainy: Rainy,
  rainyHeavy: RainyHeavy,
  snowing: Snowing,
  weatherSnowy: WeatherSnowy,
  snowingHeavy: SnowingHeavy,
  thunderstorm: Thunderstorm,
}

type WeatherIconProps = {
  code: number
  isNight?: boolean
  size?: number
  sx?: SxProps<Theme>
}

// Bridges a Material Symbols (SVG) glyph into MUI styling: the symbol fills with
// `currentColor`, so the wrapper's `color` (via sx) sets the icon color.
export function WeatherIcon({ code, isNight = false, size = 24, sx }: WeatherIconProps) {
  const Icon = ICON_COMPONENTS[getWeatherIcon(code, isNight)]
  return (
    <Box component="span" sx={{ display: 'inline-flex', lineHeight: 0, ...sx }}>
      <Icon size={size} />
    </Box>
  )
}
