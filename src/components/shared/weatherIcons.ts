import { getWeatherCondition } from '../../domain/weatherCodes'
import type { WeatherIntensity } from '../../types/weather'

/** Material Symbols glyphs (camelCased) the app draws; each platform maps them to its own components. */
export const WEATHER_ICON_NAMES = [
  'sunny',
  'bedtime',
  'partlyCloudyDay',
  'partlyCloudyNight',
  'cloud',
  'foggy',
  'rainyLight',
  'rainy',
  'rainyHeavy',
  'snowing',
  'weatherSnowy',
  'snowingHeavy',
  'thunderstorm',
] as const

export type WeatherIconName = (typeof WEATHER_ICON_NAMES)[number]

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
  day: WeatherIconName
  night: WeatherIconName
}

const sameDayAndNight = (icon: WeatherIconName): IconSet => ({ day: icon, night: icon })

const ICONS: Record<IconKey, IconSet> = {
  clear: { day: 'sunny', night: 'bedtime' },
  partlyCloudy: { day: 'partlyCloudyDay', night: 'partlyCloudyNight' },
  overcast: sameDayAndNight('cloud'),
  fog: sameDayAndNight('foggy'),
  rainLight: sameDayAndNight('rainyLight'),
  rain: sameDayAndNight('rainy'),
  rainHeavy: sameDayAndNight('rainyHeavy'),
  snowLight: sameDayAndNight('snowing'),
  snow: sameDayAndNight('weatherSnowy'),
  snowHeavy: sameDayAndNight('snowingHeavy'),
  thunder: sameDayAndNight('thunderstorm'),
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

export function getWeatherIcon(code: number, isNight = false): WeatherIconName {
  const icons = ICONS[resolveIconKey(code)]
  return isNight ? icons.night : icons.day
}
