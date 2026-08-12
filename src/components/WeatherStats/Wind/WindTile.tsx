import AirIcon from '@mui/icons-material/Air'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { WeatherStats } from '../../../types/weather'
import { StatTile, StatValue } from '../../shared'
import { WindDial } from './WindDial'

type WindTileProps = {
  wind: WeatherStats['wind']
}

const DIRECTION_WORDS: Record<string, string> = {
  N: 'north',
  NE: 'northeast',
  E: 'east',
  SE: 'southeast',
  S: 'south',
  SW: 'southwest',
  W: 'west',
  NW: 'northwest',
}

const CALM_WIND_SPEED = 0
const LIGHT_WIND_MAX_SPEED = 3

function windFromLabel(wind: WeatherStats['wind']): string {
  const from = `From ${DIRECTION_WORDS[wind.direction] ?? wind.direction}`
  if (wind.value === CALM_WIND_SPEED) return 'Calm'
  if (wind.value <= LIGHT_WIND_MAX_SPEED) return `Light · ${from}`
  return from
}

export function WindTile({ wind }: WindTileProps) {
  return (
    <StatTile icon={AirIcon} label="Wind">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.25}
        sx={{ flex: 1, minHeight: 82 }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <StatValue value={wind.value} unit={wind.unit} />
          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.8, lineHeight: 1.35 }}
          >
            {windFromLabel(wind)}
          </Typography>
          {wind.gusts !== null && wind.gusts > wind.value && (
            <Typography
              variant="caption"
              component="p"
              sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.35, lineHeight: 1.35 }}
            >
              Gusts {wind.gusts} {wind.unit}
            </Typography>
          )}
        </Box>
        <WindDial wind={wind} />
      </Stack>
    </StatTile>
  )
}
