import type { HourlyForecastEntry } from '../../types/weather'
import { SectionTitle } from '../shared/typography'
import { Item, Label, Row, Temperature, Wrapper } from './HourlyForecast.styles'

type HourlyForecastProps = {
  data: HourlyForecastEntry[]
  temperatureLabel: string
}

export function HourlyForecast({ data, temperatureLabel }: HourlyForecastProps) {
  return (
    <Wrapper>
      <SectionTitle>24-Hour Forecast</SectionTitle>
      <Row>
        {data.map((entry) => (
          <Item key={entry.hour} $active={entry.isNow}>
            <Label>{entry.hour}</Label>
            <Temperature>
              {entry.temperature}
              {temperatureLabel}
            </Temperature>
          </Item>
        ))}
      </Row>
    </Wrapper>
  )
}
