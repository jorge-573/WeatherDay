import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import type { UnitSystem } from '../../config/units'
import { UnitToggle } from '../UnitToggle'

type SettingsControlsProps = {
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
  locationOnStartup: boolean
  onLocationOnStartupChange: (enabled: boolean) => void
}

export function SettingsControls({
  units,
  onUnitsChange,
  locationOnStartup,
  onLocationOnStartupChange,
}: SettingsControlsProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Temperature units
        </Typography>
        <UnitToggle units={units} onChange={onUnitsChange} />
      </Stack>

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
    </Stack>
  )
}
