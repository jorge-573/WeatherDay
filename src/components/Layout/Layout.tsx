import Box from '@mui/material/Box'
import { Outlet, useLocation } from 'react-router-dom'
import { useCityLocation } from '../../hooks/useCityLocation'
import { useUnitPreference } from '../../hooks/useUnitPreference'
import { useWeather } from '../../hooks/useWeather'
import { radarBackground } from '../../theme/backgrounds'
import { getTimeOfDay } from '../../utils/getTimeOfDay'
import { BackgroundScene } from '../BackgroundScene'
import { Footer } from '../Footer'
import { Header } from '../Header'
import type { LayoutContext } from './useLayoutContext'

export function Layout() {
  const cityLocation = useCityLocation()
  const { units, setUnits } = useUnitPreference()
  const { data, loading, error } = useWeather(cityLocation.city, units)
  const { pathname } = useLocation()

  const isRadar = pathname === '/radar'
  const timeOfDay = data?.timeOfDay ?? getTimeOfDay(new Date())

  const context: LayoutContext = { data, loading, error, units, cityLocation, onUnitChange: setUnits }

  const shell = (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header units={units} cityLocation={cityLocation} onUnitChange={setUnits} />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1080,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Outlet context={context} />
      </Box>

      <Footer />
    </Box>
  )

  if (isRadar) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundImage: radarBackground, backgroundAttachment: 'fixed' }}>{shell}</Box>
    )
  }

  return <BackgroundScene timeOfDay={timeOfDay}>{shell}</BackgroundScene>
}
