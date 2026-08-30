import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

export function useIsMobile(): boolean {
  return useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
}
