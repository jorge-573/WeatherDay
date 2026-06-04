import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AirIcon from '@mui/icons-material/Air'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import type { SvgIconComponent } from '@mui/icons-material'
import type { WeatherStats as WeatherStatsData } from '../../types/weather'

type WeatherStatsProps = {
  data: WeatherStatsData
}

type TileProps = {
  icon: SvgIconComponent
  label: string
  children: React.ReactNode
}

function Tile({ icon: Icon, label, children }: TileProps) {
  return (
    <Paper sx={{ p: 2.5, height: '100%', backgroundColor: (t) => t.md3.surfaceContainer }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 1.5 }}>
        <Icon fontSize="small" />
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
          {label}
        </Typography>
      </Stack>
      {children}
    </Paper>
  )
}

export function WeatherStats({ data }: WeatherStatsProps) {
  const { sun, wind, uv } = data

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      <Tile icon={WbTwilightIcon} label="Sunrise & Sunset">
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 700 }}>{sun.sunrise}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Sunrise
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.round(sun.progress * 100)}
            sx={{
              height: 6,
              borderRadius: 999,
              backgroundColor: (t) => t.md3.surfaceContainerHighest,
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                background: (t) => `linear-gradient(90deg, ${t.palette.secondary.main}, ${t.md3.accent})`,
              },
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 700 }}>{sun.sunset}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Sunset
            </Typography>
          </Stack>
        </Stack>
      </Tile>

      <Tile icon={AirIcon} label="Wind Speed">
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {wind.value}
        </Typography>
        <Typography sx={{ color: 'primary.main', fontWeight: 600 }}>
          {wind.unit} {wind.direction}
        </Typography>
      </Tile>

      <Tile icon={WbSunnyOutlinedIcon} label="UV Index">
        <Typography variant="h3" sx={{ fontWeight: 700, color: (t) => t.md3.tertiaryFixedDim }}>
          {uv.value ?? '—'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{uv.level}</Typography>
      </Tile>
    </Box>
  )
}
