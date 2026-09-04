import { glass } from '../../theme'

export const MAP_PANEL_SX = {
  borderRadius: 2,
  ...glass.overlay,
  border: 1,
  borderColor: 'divider',
} as const

export const MAP_OVERLAY_Z_INDEX = 1000
