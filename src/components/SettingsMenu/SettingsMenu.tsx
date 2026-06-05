import { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import type { UnitSystem } from '../../config/units'
import { UnitToggle } from '../UnitToggle'

type SettingsMenuProps = {
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
  locationOnStartup: boolean
  onLocationOnStartupChange: (enabled: boolean) => void
}

const menuItemSx = {
  py: 0.75,
  '&:hover': { backgroundColor: 'transparent' },
} as const

export function SettingsMenu({
  units,
  onUnitsChange,
  locationOnStartup,
  onLocationOnStartupChange,
}: SettingsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton aria-label="Settings" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'text.secondary' }}>
        <SettingsOutlinedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 280, mt: 0.5 } } }}
      >
        <MenuItem disableRipple onClick={(e) => e.stopPropagation()} sx={menuItemSx}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" gap={2}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Temperature units
            </Typography>
            <UnitToggle units={units} onChange={onUnitsChange} />
          </Stack>
        </MenuItem>

        <MenuItem disableRipple onClick={(e) => e.stopPropagation()} sx={menuItemSx}>
          <FormControlLabel
            sx={{ m: 0, width: '100%' }}
            control={
              <Switch
                checked={locationOnStartup}
                onChange={(_, checked) => onLocationOnStartupChange(checked)}
                color="primary"
              />
            }
            label="Use my location on startup"
          />
        </MenuItem>
      </Menu>
    </>
  )
}
