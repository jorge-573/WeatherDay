import SunnyIcon from '@mui/icons-material/Sunny'
import clearNightBackground from '../../assets/backgrounds/NightSky.png'
import type { CurrentWeatherSnapshot } from '../../types/weather'
import {
  BackgroundImage,
  City,
  ConditionIcon,
  ConditionText,
  Condition,
  TempRow,
  MetaRow,
  MetaTag,
  Summary,
  Temperature,
  Wrapper,
} from './CurrentWeather.styles'

type CurrentWeatherProps = {
  data: CurrentWeatherSnapshot
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const { location, temperature, condition, high, low, feelsLike } = data

  return (
    <Wrapper>
      <BackgroundImage $backgroundImage={clearNightBackground} />
      <Summary>
        <div>
          <City>{location}</City>
          <TempRow>
            <ConditionIcon>
              <SunnyIcon sx={{ fontSize: 125 }} />
            </ConditionIcon>
            <ConditionText>
              <Temperature>{temperature} deg</Temperature>
              <Condition>{condition}</Condition>
            </ConditionText>
          </TempRow>
        </div>
        <MetaRow>
          <MetaTag>
            H: {high} | L: {low}
          </MetaTag>
          <MetaTag>Feels like {feelsLike}</MetaTag>
        </MetaRow>
      </Summary>
    </Wrapper>
  )
}
