import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useLayoutContext } from '../../components/Layout'
import { OutlookMap } from '../../components/OutlookMap'
import { SectionLabel } from '../../components/shared'

export function Outlooks() {
  const { cityLocation } = useLayoutContext()

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <SectionLabel>National Forecast Maps</SectionLabel>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Outlooks
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
          Official NOAA severe-weather and temperature outlooks. Select a product, forecast day, and map view below.
        </Typography>
      </Box>

      <OutlookMap city={cityLocation.city} />
    </Stack>
  )
}
