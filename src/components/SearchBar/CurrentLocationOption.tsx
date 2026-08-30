import CircularProgress from '@mui/material/CircularProgress'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { CURRENT_LOCATION_OPTION } from './searchOptions'

type CurrentLocationOptionContentProps = {
  locating: boolean
  error: string | null
}

export function CurrentLocationOptionContent({ locating, error }: CurrentLocationOptionContentProps) {
  return (
    <>
      <ListItemIcon sx={{ minWidth: 36, color: error ? 'error.main' : 'text.secondary' }}>
        {locating ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon fontSize="small" />}
      </ListItemIcon>
      <ListItemText
        primary={CURRENT_LOCATION_OPTION.name}
        secondary={error}
        primaryTypographyProps={{ fontWeight: 600 }}
        secondaryTypographyProps={{ color: 'error.main' }}
      />
    </>
  )
}
