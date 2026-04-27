import type { TimeOfDay } from '../../types/timeOfDay'
import { Day, Range, Row, Temp, Title, Wrapper } from './DailyForecast.styles'

type DailyForecastProps = {
  timeOfDay: TimeOfDay
}

const dailyForecast = [
  { day: 'Today', low: 58, high: 76 },
  { day: 'Tue', low: 56, high: 72 },
  { day: 'Wed', low: 54, high: 65 },
  { day: 'Thu', low: 52, high: 61 },
  { day: 'Fri', low: 58, high: 78 },
  { day: 'Sat', low: 60, high: 82 },
  { day: 'Sun', low: 59, high: 79 },
]

export function DailyForecast({ timeOfDay }: DailyForecastProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Title>7-Day Forecast</Title>
      {dailyForecast.map((entry) => (
        <Row key={entry.day} $timeOfDay={timeOfDay}>
          <Day>{entry.day}</Day>
          <Range $timeOfDay={timeOfDay} />
          <Temp>
            {entry.low} / {entry.high}
          </Temp>
        </Row>
      ))}
    </Wrapper>
  )
}
