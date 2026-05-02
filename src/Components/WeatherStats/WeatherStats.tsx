import { Card, Grid, Label, Subtext, Value } from './WeatherStats.styles'

const stats = [
  { label: 'UV Index', value: '2', note: 'Low' },
  { label: 'Wind', value: '12 mph', note: 'NW direction' },
  { label: 'Humidity', value: '48%', note: 'Dew point 52 deg' },
  { label: 'Visibility', value: '10 mi', note: 'Clear view' },
]

export function WeatherStats() {
  return (
    <Grid>
      {stats.map((entry) => (
        <Card key={entry.label}>
          <Label>{entry.label}</Label>
          <Value>{entry.value}</Value>
          <Subtext>{entry.note}</Subtext>
        </Card>
      ))}
    </Grid>
  )
}
