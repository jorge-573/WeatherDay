import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { radii } from '../../theme'
import { MAP_PANEL_SX } from '../WeatherMap/panel'
import type { LegendRow } from './sources'

const CAPTION_SX = { color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1 } as const

/** Color key for precipitation intensity, matched to the active tile palette. */
export function RadarLegend({ rows }: { rows: LegendRow[] }) {
  return (
    <Box sx={{ px: 1.5, py: 1, ...MAP_PANEL_SX }}>
      <Stack spacing={1}>
        {rows.map((row) => (
          <Box key={row.label}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                lineHeight: 1.6,
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              {row.label}
            </Typography>
            <Box sx={{ height: 8, borderRadius: radii.full, backgroundImage: row.gradient }} />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.25 }}>
              <Typography variant="caption" sx={CAPTION_SX}>
                Light
              </Typography>
              <Typography variant="caption" sx={CAPTION_SX}>
                Heavy
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
