import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import type { UnitSystem } from '../../config/units'
import { SettingsControls } from './SettingsControls'

type SettingsMenuProps = {
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
  locationOnStartup: boolean
  onLocationOnStartupChange: (enabled: boolean) => void
}

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
        slotProps={{ paper: { sx: { minWidth: 280, mt: 0.5, px: 1, py: 0.5 } } }}
      >
        <MenuItem
          disableRipple
          onClick={(e) => e.stopPropagation()}
          sx={{ py: 1, '&:hover': { backgroundColor: 'transparent' } }}
        >
          <SettingsControls
            units={units}
            onUnitsChange={onUnitsChange}
            locationOnStartup={locationOnStartup}
            onLocationOnStartupChange={onLocationOnStartupChange}
          />
        </MenuItem>
      </Menu>
    </>
  )
}
