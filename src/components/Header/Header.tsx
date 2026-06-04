import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import type { UnitSystem } from '../../config/units'
import type { useCityLocation } from '../../hooks/useCityLocation'
import { SearchBar } from '../SearchBar'
import { SettingsMenu } from '../SettingsMenu'
import { UnitToggle } from '../UnitToggle'

const navLinks = ['Dashboard', 'Maps', 'Forecasts', 'Historical']
const activeLink = 'Dashboard'

type HeaderProps = {
  units: UnitSystem
  cityLocation: ReturnType<typeof useCityLocation>
  onUnitChange: (units: UnitSystem) => void
}

export function Header({ units, cityLocation, onUnitChange }: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(5, 12, 22, 0.62)',
        backdropFilter: 'blur(18px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 2, py: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: '0.08em', color: 'primary.main', textTransform: 'uppercase' }}
        >
          WeatherDay
        </Typography>

        <Stack direction="row" spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
          {navLinks.map((entry) => (
            <Link
              key={entry}
              href="#"
              underline="none"
              sx={{
                fontSize: '0.9rem',
                fontWeight: entry === activeLink ? 700 : 500,
                color: entry === activeLink ? 'text.primary' : 'text.secondary',
                borderBottom: entry === activeLink ? 2 : 0,
                borderColor: 'primary.main',
                pb: 0.5,
                '&:hover': { color: 'text.primary' },
              }}
            >
              {entry}
            </Link>
          ))}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBar
            onSearchSelect={cityLocation.selectFromSearch}
            onCurrentLocationClick={cityLocation.requestCurrentLocation}
            locating={cityLocation.locating}
            locateError={cityLocation.locateError}
          />
          <UnitToggle units={units} onChange={onUnitChange} />
          <IconButton aria-label="Notifications" sx={{ color: 'text.secondary' }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          <SettingsMenu
            locationOnStartup={cityLocation.locationOnStartup}
            onLocationOnStartupChange={cityLocation.setLocationOnStartup}
          />
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>W</Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
