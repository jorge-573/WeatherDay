import SunnyIcon from '@mui/icons-material/Sunny'
import clearNightBackground from '../../assets/backgrounds/NightSky.png'
import { currentWeatherMock } from '../../data/mocks/currentWeather'
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

export function CurrentWeather() {
  const { location, temperature, condition, high, low, feelsLike } = currentWeatherMock

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
