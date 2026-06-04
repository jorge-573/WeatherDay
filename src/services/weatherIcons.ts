import { Sunny } from '@material-symbols-svg/react/rounded/icons/sunny'
import { Bedtime } from '@material-symbols-svg/react/rounded/icons/bedtime'
import { PartlyCloudyDay } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-day'
import { PartlyCloudyNight } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-night'
import { Cloud } from '@material-symbols-svg/react/rounded/icons/cloud'
import { RainyLight } from '@material-symbols-svg/react/rounded/icons/rainy-light'
import { Rainy } from '@material-symbols-svg/react/rounded/icons/rainy'
import { RainyHeavy } from '@material-symbols-svg/react/rounded/icons/rainy-heavy'
import { Snowing } from '@material-symbols-svg/react/rounded/icons/snowing'
import { WeatherSnowy } from '@material-symbols-svg/react/rounded/icons/weather-snowy'
import { SnowingHeavy } from '@material-symbols-svg/react/rounded/icons/snowing-heavy'
import { Thunderstorm } from '@material-symbols-svg/react/rounded/icons/thunderstorm'
import { Foggy } from '@material-symbols-svg/react/rounded/icons/foggy'
import type { MaterialSymbolsComponent } from '@material-symbols-svg/react/rounded'
import { getWeatherCondition, type WeatherIntensity } from './weatherCodes'

// WMO weather interpretation codes (the numbers Open-Meteo returns). The coarse
// `WeatherCondition.group` can't tell partly cloudy from overcast (both are
// "cloudy"), so these specific codes are resolved by hand.
const WMO_CODE = {
  CLEAR: 0,
  MOSTLY_CLEAR: 1,
  PARTLY_CLOUDY: 2,
  OVERCAST: 3,
} as const

// The visual buckets we actually have distinct glyphs for. Rain and snow are
// split by intensity so light/heavy precipitation reads differently.
type IconKey =
  | 'clear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'rainLight'
  | 'rain'
  | 'rainHeavy'
  | 'snowLight'
  | 'snow'
  | 'snowHeavy'
  | 'thunder'

// A day glyph and its night counterpart (identical when there's no night variant).
type IconSet = {
  day: MaterialSymbolsComponent
  night: MaterialSymbolsComponent
}

const sameDayAndNight = (icon: MaterialSymbolsComponent): IconSet => ({ day: icon, night: icon })

const ICONS: Record<IconKey, IconSet> = {
  clear: { day: Sunny, night: Bedtime },
  partlyCloudy: { day: PartlyCloudyDay, night: PartlyCloudyNight },
  overcast: sameDayAndNight(Cloud),
  fog: sameDayAndNight(Foggy),
  rainLight: sameDayAndNight(RainyLight),
  rain: sameDayAndNight(Rainy),
  rainHeavy: sameDayAndNight(RainyHeavy),
  snowLight: sameDayAndNight(Snowing),
  snow: sameDayAndNight(WeatherSnowy),
  snowHeavy: sameDayAndNight(SnowingHeavy),
  thunder: sameDayAndNight(Thunderstorm),
}

function byIntensity(
  intensity: WeatherIntensity | undefined,
  light: IconKey,
  normal: IconKey,
  heavy: IconKey
): IconKey {
  if (intensity === 'light') return light
  if (intensity === 'heavy') return heavy
  return normal
}

function resolveIconKey(code: number): IconKey {
  switch (code) {
    case WMO_CODE.CLEAR:
    case WMO_CODE.MOSTLY_CLEAR:
      return 'clear'
    case WMO_CODE.PARTLY_CLOUDY:
      return 'partlyCloudy'
    case WMO_CODE.OVERCAST:
      return 'overcast'
  }

  // Everything else (precipitation, fog, thunder) maps from the group, refined
  // by intensity for rain and snow.
  const { group, intensity } = getWeatherCondition(code)
  switch (group) {
    case 'fog':
      return 'fog'
    case 'rain':
      return byIntensity(intensity, 'rainLight', 'rain', 'rainHeavy')
    case 'snow':
      return byIntensity(intensity, 'snowLight', 'snow', 'snowHeavy')
    case 'thunder':
      return 'thunder'
    case 'clear':
      return 'clear'
    case 'cloudy':
    default:
      return 'overcast'
  }
}

export function getWeatherIcon(code: number, isNight = false): MaterialSymbolsComponent {
  const icons = ICONS[resolveIconKey(code)]
  return isNight ? icons.night : icons.day
}
