/** Shared look for the panels floating above the map. */
export const PANEL_SX = {
  borderRadius: 2,
  backgroundColor: 'rgba(6, 10, 16, 0.82)',
  backdropFilter: 'blur(8px)',
  border: 1,
  borderColor: 'divider',
} as const

/** Clears Leaflet's own panes and controls. */
export const OVERLAY_Z_INDEX = 1000
