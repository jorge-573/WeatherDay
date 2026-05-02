import SunnyIcon from '@mui/icons-material/Sunny'
import clearNightBackground from '../../assets/backgrounds/NightSky.png'
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
  return (
    <Wrapper>
      <BackgroundImage $backgroundImage={clearNightBackground} />
      <Summary>
        <div>
          <City>San Francisco, CA</City>
          <TempRow>
            <ConditionIcon>
              <SunnyIcon sx={{ fontSize: 125 }} />
            </ConditionIcon>
            <ConditionText>
              <Temperature>72 deg</Temperature>
              <Condition>Mostly Sunny</Condition>
            </ConditionText>
          </TempRow>
        </div>
        <MetaRow>
          <MetaTag>H: 76 | L: 58</MetaTag>
          <MetaTag>Feels like 74</MetaTag>
        </MetaRow>
      </Summary>
    </Wrapper>
  )
}
