import type { TimeOfDay } from '../../types/timeOfDay'
import {
  Caption,
  City,
  Condition,
  MetaRow,
  MetaTag,
  Summary,
  Temperature,
  Title,
  Visual,
  Wrapper,
} from './CurrentWeather.styles'

type CurrentWeatherProps = {
  timeOfDay: TimeOfDay
}

export function CurrentWeather({ timeOfDay }: CurrentWeatherProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Summary>
        <div>
          <City>San Francisco, CA</City>
          <Temperature>72 deg</Temperature>
          <Condition>Mostly Sunny</Condition>
        </div>
        <MetaRow>
          <MetaTag $timeOfDay={timeOfDay}>H: 76 | L: 58</MetaTag>
          <MetaTag $timeOfDay={timeOfDay}>Feels like 74</MetaTag>
        </MetaRow>
      </Summary>

      <Visual $timeOfDay={timeOfDay}>
        <div>
          <Title>Golden Hour</Title>
          <Caption>Sunset in 42 mins</Caption>
        </div>
      </Visual>
    </Wrapper>
  )
}
