import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { navLinks } from '../../config/nav'
import type { UnitSystem } from '../../config/units'
import type { useCityLocation } from '../../hooks/useCityLocation'
import { glass } from '../../theme'
import { NavDrawer } from '../NavDrawer'
import { SearchBar } from '../SearchBar'
import { SettingsMenu, type SettingsControlsProps } from '../SettingsMenu'

type HeaderProps = {
  units: UnitSystem
  cityLocation: ReturnType<typeof useCityLocation>
  onUnitChange: (units: UnitSystem) => void
}

function desktopNavItemSx(active: boolean) {
  return {
    fontSize: '0.9rem',
    fontWeight: active ? 700 : 500,
    color: active ? 'text.primary' : 'text.secondary',
    borderBottom: active ? 2 : 0,
    borderColor: 'primary.main',
    pb: 0.5,
  } as const
}

export function Header({ units, cityLocation, onUnitChange }: HeaderProps) {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const settingsProps = {
    units,
    onUnitsChange: onUnitChange,
    locationOnStartup: cityLocation.locationOnStartup,
    onLocationOnStartupChange: cityLocation.setLocationOnStartup,
  } satisfies SettingsControlsProps

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: '100%',
        left: 0,
        right: 0,
        borderRadius: 0,
        ...glass.header,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          gap: { xs: 1, sm: 2 },
          py: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <IconButton
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.secondary', ml: -0.5 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: { xs: '0.04em', sm: '0.08em' },
            color: 'primary.main',
            textTransform: 'uppercase',
            flexShrink: 0,
            fontSize: { xs: '1rem', sm: undefined },
          }}
        >
          WeatherDay
        </Typography>

        <Stack direction="row" spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
          {navLinks.map((entry) => {
            const active = !entry.disabled && entry.to === pathname
            if (entry.disabled) {
              return (
                <Typography
                  key={entry.label}
                  component="span"
                  aria-disabled
                  sx={{ ...desktopNavItemSx(false), opacity: 0.5 }}
                >
                  {entry.label}
                </Typography>
              )
            }

            return (
              <Link
                key={entry.label}
                component={RouterLink}
                to={entry.to}
                underline="none"
                sx={{
                  ...desktopNavItemSx(active),
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {entry.label}
              </Link>
            )
          })}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
        >
          <SearchBar
            onSearchSelect={cityLocation.selectFromSearch}
            onCurrentLocationClick={cityLocation.requestCurrentLocation}
            locating={cityLocation.locating}
            locateError={cityLocation.locateError}
          />
          <Stack sx={{ display: { xs: 'none', md: 'block' } }}>
            <SettingsMenu {...settingsProps} />
          </Stack>
        </Stack>
      </Toolbar>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname} {...settingsProps} />
    </AppBar>
  )
}
