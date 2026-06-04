import { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

type SettingsMenuProps = {
  locationOnStartup: boolean
  onLocationOnStartupChange: (enabled: boolean) => void
}

export function SettingsMenu({ locationOnStartup, onLocationOnStartupChange }: SettingsMenuProps) {
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
        slotProps={{ paper: { sx: { minWidth: 260, mt: 0.5 } } }}
      >
        <MenuItem
          disableRipple
          onClick={(e) => e.stopPropagation()}
          sx={{ py: 0.5, '&:hover': { backgroundColor: 'transparent' } }}
        >
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
