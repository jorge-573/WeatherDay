import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import type { UnitSystem } from '../../config/units'

type UnitToggleProps = {
  units: UnitSystem
  onChange: (units: UnitSystem) => void
}

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={units}
      onChange={(_, next: UnitSystem | null) => {
        if (next) onChange(next)
      }}
      aria-label="Temperature units"
      sx={{
        '& .MuiToggleButton-root': {
          px: 1.5,
          py: 0.5,
          border: 'none',
          borderRadius: '9999px !important',
          color: 'text.secondary',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { backgroundColor: 'primary.main' },
          },
        },
      }}
    >
      <ToggleButton value="imperial" aria-label="Fahrenheit">
        °F
      </ToggleButton>
      <ToggleButton value="metric" aria-label="Celsius">
        °C
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
