import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { getWeatherIcon } from './weatherIcons'
import { WEATHER_ICON_PATHS } from './weatherIconPaths'

type WeatherIconProps = {
  code: number
  isNight?: boolean
  size?: number
  sx?: SxProps<Theme>
}

// The glyph fills with `currentColor`, so the wrapper's `color` (via sx) sets the icon color.
export function WeatherIcon({ code, isNight = false, size = 24, sx }: WeatherIconProps) {
  const name = getWeatherIcon(code, isNight)
  return (
    <Box component="span" sx={{ display: 'inline-flex', lineHeight: 0, ...sx }}>
      <svg width={size} height={size} viewBox="0 -960 960 960" fill="none" aria-hidden="true">
        <path d={WEATHER_ICON_PATHS[name]} fill="currentColor" />
      </svg>
    </Box>
  )
}
