import { Day, Range, Row, Temp, Title, Wrapper } from './DailyForecast.styles'

const dailyForecast = [
  { day: 'Today', low: 58, high: 76 },
  { day: 'Tue', low: 56, high: 72 },
  { day: 'Wed', low: 54, high: 65 },
  { day: 'Thu', low: 52, high: 61 },
  { day: 'Fri', low: 58, high: 78 },
  { day: 'Sat', low: 60, high: 82 },
  { day: 'Sun', low: 59, high: 79 },
]

export function DailyForecast() {
  return (
    <Wrapper>
      <Title>7-Day Forecast</Title>
      {dailyForecast.map((entry) => (
        <Row key={entry.day}>
          <Day>{entry.day}</Day>
          <Range />
          <Temp>
            {entry.low} / {entry.high}
          </Temp>
        </Row>
      ))}
    </Wrapper>
  )
}
