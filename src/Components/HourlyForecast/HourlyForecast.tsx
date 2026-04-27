import type { TimeOfDay } from '../../types/timeOfDay'
import { Item, Label, Row, Temp, Title, Wrapper } from './HourlyForecast.styles'

type HourlyForecastProps = {
  timeOfDay: TimeOfDay
}

const hourlyForecast = [
  { hour: 'Now', temp: 72, active: true },
  { hour: '2 PM', temp: 74, active: false },
  { hour: '3 PM', temp: 76, active: false },
  { hour: '4 PM', temp: 75, active: false },
  { hour: '5 PM', temp: 73, active: false },
  { hour: '6 PM', temp: 69, active: false },
]

export function HourlyForecast({ timeOfDay }: HourlyForecastProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Title>24-Hour Forecast</Title>
      <Row>
        {hourlyForecast.map((entry) => (
          <Item key={entry.hour} $timeOfDay={timeOfDay} $active={entry.active}>
            <Label>{entry.hour}</Label>
            <Temp>{entry.temp} deg</Temp>
          </Item>
        ))}
      </Row>
    </Wrapper>
  )
}
