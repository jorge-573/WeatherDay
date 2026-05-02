import { weatherStatsMock } from '../../data/mocks/weatherStats'
import { Card, Grid, Label, Subtext, Value } from './WeatherStats.styles'

export function WeatherStats() {
  return (
    <Grid>
      {weatherStatsMock.map((entry) => (
        <Card key={entry.label}>
          <Label>{entry.label}</Label>
          <Value>{entry.value}</Value>
          <Subtext>{entry.note}</Subtext>
        </Card>
      ))}
    </Grid>
  )
}
