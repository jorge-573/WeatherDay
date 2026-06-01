import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { getWeatherIcon } from '../../services/weatherIcons'

type WeatherIconProps = {
  code: number
  isNight?: boolean
  size?: number
  sx?: SxProps<Theme>
}

// Bridges a Material Symbols (SVG) glyph into MUI styling: the symbol fills with
// `currentColor`, so the wrapper's `color` (via sx) sets the icon color.
export function WeatherIcon({ code, isNight = false, size = 24, sx }: WeatherIconProps) {
  const Icon = getWeatherIcon(code, isNight)
  return (
    <Box component="span" sx={{ display: 'inline-flex', lineHeight: 0, ...sx }}>
      <Icon size={size} />
    </Box>
  )
}
