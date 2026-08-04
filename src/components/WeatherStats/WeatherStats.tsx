import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
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
import { aqiColors, gradients, radii } from '../../theme'
import type { AirQuality, PressureTrend, WeatherStats as WeatherStatsData } from '../../types/weather'
import { SectionLabel, StatTile } from '../shared'

type WeatherStatsProps = {
  data: WeatherStatsData
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

function SunBody({ sunrise, sunset, progress }: { sunrise: string; sunset: string; progress: number }) {
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography sx={{ fontWeight: 700 }}>{sunrise}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Rise
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.round(progress * 100)}
        sx={{
          height: 5,
          borderRadius: radii.full,
          backgroundColor: (t) => t.md3.surfaceContainerHighest,
          '& .MuiLinearProgress-bar': {
            borderRadius: radii.full,
            background: gradients.accentBar,
          },
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography sx={{ fontWeight: 700 }}>{sunset}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Set
        </Typography>
      </Stack>
    </Stack>
  )
}

function sunDetail(daylight: string | null, sunshine: string | null): string | null {
  if (!daylight) return null
  return sunshine ? `${daylight} of daylight · ${sunshine} of sun` : `${daylight} of daylight`
}

function windDetail(direction: string, gusts: number | null, unit: string): string {
  return gusts === null ? `From ${direction}` : `From ${direction} · Gusts ${gusts} ${unit}`
}

function precipitationDetail(hours: number | null): string | null {
  if (hours === null) return null
  return hours === 0 ? 'Dry all day' : `${hours} h with precipitation`
}

function airQualityDetail(airQuality: AirQuality | null): string {
  if (!airQuality) return 'No data'
  return airQuality.pm25 === null ? airQuality.label : `${airQuality.label} · PM2.5 ${airQuality.pm25}`
}

export function WeatherStats({ data, airQuality, temperatureLabel }: WeatherStatsProps) {
  const { sun, wind, uv, humidity, precipitation, pressure, visibility } = data

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
        <StatTile icon={WbTwilightIcon} label="Sun" detail={sunDetail(sun.daylight, sun.sunshine)}>
          <SunBody sunrise={sun.sunrise} sunset={sun.sunset} progress={sun.progress} />
        </StatTile>

        <StatTile
          icon={AirIcon}
          label="Wind"
          value={wind.value}
          unit={wind.unit}
          detail={windDetail(wind.direction, wind.gusts, wind.unit)}
        />

        <StatTile
          icon={WbSunnyOutlinedIcon}
          label="UV Index"
          value={uv.value}
          detail={uv.level}
          valueColor={(t) => t.md3.tertiaryFixedDim}
        />

        <StatTile
          icon={WaterDropOutlinedIcon}
          label="Humidity"
          value={humidity.value}
          unit="%"
          detail={humidity.dewPoint === null ? null : `Dew point ${humidity.dewPoint}${temperatureLabel}`}
        />

        <StatTile
          icon={UmbrellaIcon}
          label="Precipitation"
          value={precipitation.total}
          unit={precipitation.unit}
          detail={precipitationDetail(precipitation.hours)}
        />

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
