import { dailyForecastMock } from '../../data/mocks/dailyForecast'
import { SectionTitle } from '../shared/typography'
import { Day, Range, Row, Temperature, Wrapper } from './DailyForecast.styles'

export function DailyForecast() {
  return (
    <Wrapper>
      <SectionTitle>7-Day Forecast</SectionTitle>
      {dailyForecastMock.map((entry) => (
        <Row key={entry.day}>
          <Day>{entry.day}</Day>
          <Range />
          <Temperature>
            {entry.low} / {entry.high}
          </Temperature>
        </Row>
      ))}
    </Wrapper>
  )
}
