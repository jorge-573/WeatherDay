import { glass } from '../../theme'

/** Shared look for the panels floating above the map. */
export const PANEL_SX = {
  borderRadius: 2,
  ...glass.overlay,
  border: 1,
  borderColor: 'divider',
} as const

/** Clears Leaflet's own panes and controls. */
export const OVERLAY_Z_INDEX = 1000
