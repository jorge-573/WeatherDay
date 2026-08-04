import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import type { RadarSource } from '../../types/radar'
import { PANEL_SX } from './panel'
import { SOURCE_META, SOURCE_ORDER } from './sources'

type RadarSourceToggleProps = {
  source: RadarSource
  /** NOAA was picked but the location sits outside its coverage. */
  coverageFallback: boolean
  onChange: (source: RadarSource) => void
}

export function RadarSourceToggle({ source, coverageFallback, onChange }: RadarSourceToggleProps) {
  return (
    <Box sx={{ px: 1, py: 0.75, ...PANEL_SX }}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={source}
        aria-label="Radar source"
        onChange={(_, value: RadarSource | null) => {
          if (value) onChange(value)
        }}
      >
        {SOURCE_ORDER.map((value) => (
          <ToggleButton
            key={value}
            value={value}
            aria-label={SOURCE_META[value].description}
            sx={{
              px: { xs: 0.5, sm: 1 },
              py: 0.5,
              minHeight: 34,
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              fontWeight: 700,
              letterSpacing: '0.04em',
              lineHeight: 1.2,
              color: 'text.secondary',
              borderColor: 'divider',
              '&.Mui-selected': {
                color: (t) => t.md3.accent,
                backgroundColor: (t) => t.md3.surfaceBright,
                '&:hover': { backgroundColor: (t) => t.md3.surfaceBright },
              },
            }}
          >
            {SOURCE_META[value].label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {coverageFallback && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 0.75, color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1.4 }}
        >
          NOAA covers the US only — showing RainViewer.
        </Typography>
      )}
    </Box>
  )
}
