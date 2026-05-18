import type { HourlyForecastEntry } from '../../types/weather'
import { SectionTitle } from '../shared/typography'
import { Item, Label, Row, Temperature, Wrapper } from './HourlyForecast.styles'

type HourlyForecastProps = {
  data: HourlyForecastEntry[]
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <Wrapper>
      <SectionTitle>24-Hour Forecast</SectionTitle>
      <Row>
        {data.map((entry) => (
          <Item key={entry.hour} $active={entry.isNow}>
            <Label>{entry.hour}</Label>
            <Temperature>{entry.temperature} deg</Temperature>
          </Item>
        ))}
      </Row>
    </Wrapper>
  )
}
