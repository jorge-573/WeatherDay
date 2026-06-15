import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import RadarRoundedIcon from '@mui/icons-material/RadarRounded'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import type { UnitSystem } from '../../config/units'
import type { useCityLocation } from '../../hooks/useCityLocation'
import { SearchBar } from '../SearchBar'
import { SettingsMenu } from '../SettingsMenu'

type NavLinkItem = {
  label: string
  to?: string
}

const navLinks: NavLinkItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Radar', to: '/radar' },
  { label: 'Forecasts' },
  { label: 'Historical' },
]

type HeaderProps = {
  units: UnitSystem
  cityLocation: ReturnType<typeof useCityLocation>
  onUnitChange: (units: UnitSystem) => void
}

export function Header({ units, cityLocation, onUnitChange }: HeaderProps) {
  const { pathname } = useLocation()
  const isRadar = pathname === '/radar'

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: '100%',
        left: 0,
        right: 0,
        borderRadius: 0,
        backgroundColor: 'rgba(5, 12, 22, 0.62)',
        backdropFilter: 'blur(18px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: '100%',
          maxWidth: 'none',
          gap: 2,
          py: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: '0.08em', color: 'primary.main', textTransform: 'uppercase' }}
        >
          WeatherDay
        </Typography>

        <Stack direction="row" spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
          {navLinks.map((entry) => {
            const active = entry.to !== undefined && entry.to === pathname
            return (
              <Link
                key={entry.label}
                {...(entry.to ? { component: RouterLink, to: entry.to } : { href: '#' })}
                underline="none"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'text.primary' : 'text.secondary',
                  borderBottom: active ? 2 : 0,
                  borderColor: 'primary.main',
                  pb: 0.5,
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {entry.label}
              </Link>
            )
          })}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            component={RouterLink}
            to="/radar"
            aria-label="Open radar"
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              color: isRadar ? 'primary.main' : 'text.secondary',
            }}
          >
            <RadarRoundedIcon />
          </IconButton>
          <SearchBar
            onSearchSelect={cityLocation.selectFromSearch}
            onCurrentLocationClick={cityLocation.requestCurrentLocation}
            locating={cityLocation.locating}
            locateError={cityLocation.locateError}
          />
          <SettingsMenu
            units={units}
            onUnitsChange={onUnitChange}
            locationOnStartup={cityLocation.locationOnStartup}
            onLocationOnStartupChange={cityLocation.setLocationOnStartup}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
