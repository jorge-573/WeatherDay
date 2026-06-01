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
  temperatureLabel: string
}

export function CurrentWeather({ data, temperatureLabel }: CurrentWeatherProps) {
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
              <Temperature>
                {temperature}
                {temperatureLabel}
              </Temperature>
              <Condition>{condition}</Condition>
            </ConditionText>
          </TempRow>
        </div>
        <MetaRow>
          <MetaTag>
            H: {high}
            {temperatureLabel} | L: {low}
            {temperatureLabel}
          </MetaTag>
          <MetaTag>
            Feels like {feelsLike}
            {temperatureLabel}
          </MetaTag>
        </MetaRow>
      </Summary>
    </Wrapper>
  )
}
