import { hourlyForecastMock } from '../../data/mocks/hourlyForecast'
import { SectionTitle } from '../shared/typography'
import { Item, Label, Row, Temperature, Wrapper } from './HourlyForecast.styles'

export function HourlyForecast() {
  return (
    <Wrapper>
      <SectionTitle>24-Hour Forecast</SectionTitle>
      <Row>
        {hourlyForecastMock.map((entry) => (
          <Item key={entry.hour} $active={entry.isNow}>
            <Label>{entry.hour}</Label>
            <Temperature>{entry.temperature} deg</Temperature>
          </Item>
        ))}
      </Row>
    </Wrapper>
  )
}
