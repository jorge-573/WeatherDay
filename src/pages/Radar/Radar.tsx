import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useLayoutContext } from '../../components/Layout'
import { RadarMap } from '../../components/RadarMap'
import { SectionLabel } from '../../components/shared/SectionLabel'

export function Radar() {
  const { cityLocation } = useLayoutContext()
  const { city } = cityLocation
  const locationName = [city.name, city.admin1, city.country].filter(Boolean).join(', ')

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <SectionLabel>Precipitation Radar</SectionLabel>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {city.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Live precipitation with a two-hour forecast. Press play to animate.
        </Typography>
      </Box>

      <Box
        sx={{
          height: { xs: 360, md: 560 },
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <RadarMap latitude={city.latitude} longitude={city.longitude} locationName={locationName} />
      </Box>
    </Stack>
  )
}
