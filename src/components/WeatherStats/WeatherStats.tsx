import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AirIcon from '@mui/icons-material/Air'
import BlurOnIcon from '@mui/icons-material/BlurOn'
import SpeedIcon from '@mui/icons-material/Speed'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import UmbrellaIcon from '@mui/icons-material/Umbrella'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import type { SvgIconComponent } from '@mui/icons-material'
import { aqiColors } from '../../theme'
import type {
  AirQuality,
  HourlyForecastEntry,
  PressureTrend,
  WeatherStats as WeatherStatsData,
} from '../../types/weather'
import { SectionLabel, StatTile } from '../shared'
import { HumidityMeter } from './HumidityMeter'
import { PrecipitationTimeline } from './PrecipitationTimeline'
import { SunArc } from './SunArc'
import { sunCountdown } from './sunCountdown'
import { UvGauge } from './UvGauge'
import { WindDial } from './WindDial'

type WeatherStatsProps = {
  data: WeatherStatsData
  hourly: HourlyForecastEntry[]
  airQuality: AirQuality | null
  temperatureLabel: string
}

const PRESSURE_TRENDS: Record<PressureTrend, { icon: SvgIconComponent; label: string }> = {
  rising: { icon: TrendingUpIcon, label: 'Rising' },
  falling: { icon: TrendingDownIcon, label: 'Falling' },
  steady: { icon: TrendingFlatIcon, label: 'Steady' },
}

function PressureDetail({ trend }: { trend: PressureTrend }) {
  const { icon: Icon, label } = PRESSURE_TRENDS[trend]
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Icon sx={{ fontSize: 14 }} />
      {label}
    </Box>
  )
}

function sunDetail(sun: WeatherStatsData['sun']): string | null {
  const countdown = sunCountdown(sun)
  const sunshine = sun.sunshine ? `${sun.sunshine} of sun` : null
  return [countdown, sunshine].filter(Boolean).join(' · ') || null
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

function windFromLabel(wind: WeatherStatsData['wind']): string {
  const from = `From ${DIRECTION_WORDS[wind.direction] ?? wind.direction}`
  if (wind.value <= 3) return [`Calm`, from].join(' · ')
  return from
}

function humidityComfort(value: number | null): string | null {
  if (value === null) return null
  if (value < 30) return 'Dry'
  if (value <= 60) return 'Comfortable'
  return 'Humid'
}

function precipitationDetail(hours: number | null): string | null {
  if (hours === null) return null
  return hours === 0 ? 'Dry all day' : `${hours} h with precipitation`
}

function airQualityDetail(airQuality: AirQuality | null): string {
  if (!airQuality) return 'No data'
  return airQuality.pm25 === null ? airQuality.label : `${airQuality.label} · PM2.5 ${airQuality.pm25}`
}

export function WeatherStats({ data, hourly, airQuality, temperatureLabel }: WeatherStatsProps) {
  const { sun, wind, uv, humidity, precipitation, pressure, visibility } = data
  const humidityLabel = humidityComfort(humidity.value)

  return (
    <Box>
      <SectionLabel>Conditions</SectionLabel>
      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <StatTile icon={WbTwilightIcon} label="Sun" detail={sunDetail(sun)}>
          <SunArc sun={sun} />
        </StatTile>

        <StatTile icon={AirIcon} label="Wind">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.25}
            sx={{ flex: 1, minHeight: 82 }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {wind.value}
                <Box component="span" sx={{ ml: 0.5, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
                  {wind.unit}
                </Box>
              </Typography>
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

        <StatTile icon={WbSunnyOutlinedIcon} label="UV Index">
          <UvGauge uv={uv} />
        </StatTile>

        <StatTile icon={WaterDropOutlinedIcon} label="Humidity">
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ flex: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {humidity.value ?? '—'}
                {humidity.value !== null && (
                  <Box component="span" sx={{ ml: 0.35, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
                    %
                  </Box>
                )}
              </Typography>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.8, lineHeight: 1.35 }}
              >
                {humidity.dewPoint === null
                  ? 'Dew point unavailable'
                  : `Dew point ${humidity.dewPoint}${temperatureLabel}`}
              </Typography>
              {humidityLabel && (
                <Typography
                  variant="caption"
                  component="p"
                  sx={{ color: (t) => t.md3.accent, fontWeight: 700, mt: 0.35, lineHeight: 1.35 }}
                >
                  {humidityLabel}
                </Typography>
              )}
            </Box>
            <HumidityMeter value={humidity.value} />
          </Stack>
        </StatTile>

        <StatTile icon={UmbrellaIcon} label="Precipitation">
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {precipitation.total ?? '—'}
            {precipitation.total !== null && (
              <Box component="span" sx={{ ml: 0.5, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
                {precipitation.unit}
              </Box>
            )}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.6, lineHeight: 1.35 }}
          >
            {precipitationDetail(precipitation.hours)}
          </Typography>
          <PrecipitationTimeline data={hourly} />
        </StatTile>

        <StatTile
          icon={SpeedIcon}
          label="Pressure"
          value={pressure.value}
          unit={pressure.unit}
          detail={<PressureDetail trend={pressure.trend} />}
        />

        <StatTile icon={VisibilityOutlinedIcon} label="Visibility" value={visibility.value} unit={visibility.unit} />

        <StatTile
          icon={BlurOnIcon}
          label="Air Quality"
          value={airQuality?.aqi}
          detail={airQualityDetail(airQuality)}
          valueColor={airQuality ? aqiColors[airQuality.category] : undefined}
        />
      </Box>
    </Box>
  )
}
