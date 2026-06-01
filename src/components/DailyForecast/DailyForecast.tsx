import type { DailyForecastEntry } from '../../types/weather'
import { SectionTitle } from '../shared/typography'
import { Day, Range, Row, Temperature, Wrapper } from './DailyForecast.styles'

type DailyForecastProps = {
  data: DailyForecastEntry[]
  temperatureLabel: string
}

export function DailyForecast({ data, temperatureLabel }: DailyForecastProps) {
  return (
    <Wrapper>
      <SectionTitle>7-Day Forecast</SectionTitle>
      {data.map((entry) => (
        <Row key={entry.day}>
          <Day>{entry.day}</Day>
          <Range />
          <Temperature>
            {entry.low}
            {temperatureLabel} / {entry.high}
            {temperatureLabel}
          </Temperature>
        </Row>
      ))}
    </Wrapper>
  )
}
