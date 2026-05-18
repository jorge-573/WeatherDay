import type { WeatherStat } from '../../types/weather'
import { Card, Grid, Label, Subtext, Value } from './WeatherStats.styles'

type WeatherStatsProps = {
  data: WeatherStat[]
}

export function WeatherStats({ data }: WeatherStatsProps) {
  return (
    <Grid>
      {data.map((entry) => (
        <Card key={entry.label}>
          <Label>{entry.label}</Label>
          <Value>{entry.value}</Value>
          <Subtext>{entry.note}</Subtext>
        </Card>
      ))}
    </Grid>
  )
}
