import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { navLinks } from '../../config/nav'
import type { UnitSystem } from '../../config/units'
import { glass } from '../../theme'
import { SettingsControls } from '../SettingsMenu/SettingsControls'

type NavDrawerProps = {
  open: boolean
  onClose: () => void
  pathname: string
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
  locationOnStartup: boolean
  onLocationOnStartupChange: (enabled: boolean) => void
}

export function NavDrawer({
  open,
  onClose,
  pathname,
  units,
  onUnitsChange,
  locationOnStartup,
  onLocationOnStartupChange,
}: NavDrawerProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 300,
            ...glass.overlay,
            backgroundImage: 'none',
            borderRadius: 0,
          },
        },
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'primary.main',
            textTransform: 'uppercase',
          }}
        >
          WeatherDay
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {navLinks.map((entry) => {
          const active = entry.to !== undefined && entry.to === pathname
          return (
            <ListItemButton
              key={entry.label}
              {...(entry.to ? { component: RouterLink, to: entry.to, onClick: onClose } : { disabled: true })}
              selected={active}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: (theme) => theme.md3.surfaceContainerHighest,
                },
              }}
            >
              <ListItemText
                primary={entry.label}
                primaryTypographyProps={{
                  fontWeight: active ? 700 : 500,
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.12em' }}>
          Settings
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <SettingsControls
            units={units}
            onUnitsChange={onUnitsChange}
            locationOnStartup={locationOnStartup}
            onLocationOnStartupChange={onLocationOnStartupChange}
          />
        </Box>
      </Box>
    </Drawer>
  )
}
