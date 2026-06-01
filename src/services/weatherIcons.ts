import { Sunny } from '@material-symbols-svg/react/rounded/icons/sunny'
import { Bedtime } from '@material-symbols-svg/react/rounded/icons/bedtime'
import { PartlyCloudyDay } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-day'
import { PartlyCloudyNight } from '@material-symbols-svg/react/rounded/icons/partly-cloudy-night'
import { Cloud } from '@material-symbols-svg/react/rounded/icons/cloud'
import { Rainy } from '@material-symbols-svg/react/rounded/icons/rainy'
import { WeatherSnowy } from '@material-symbols-svg/react/rounded/icons/weather-snowy'
import { Thunderstorm } from '@material-symbols-svg/react/rounded/icons/thunderstorm'
import { Foggy } from '@material-symbols-svg/react/rounded/icons/foggy'
import type { MaterialSymbolsComponent } from '@material-symbols-svg/react/rounded'
import { getWeatherCondition } from './weatherCodes'

export function getWeatherIcon(code: number, isNight = false): MaterialSymbolsComponent {
  if (code === 0 || code === 1) return isNight ? Bedtime : Sunny
  if (code === 2) return isNight ? PartlyCloudyNight : PartlyCloudyDay
  if (code === 3) return Cloud

  switch (getWeatherCondition(code).group) {
    case 'fog':
      return Foggy
    case 'rain':
      return Rainy
    case 'snow':
      return WeatherSnowy
    case 'thunder':
      return Thunderstorm
    case 'cloudy':
      return Cloud
    case 'clear':
      return isNight ? Bedtime : Sunny
    default:
      return Cloud
  }
}
