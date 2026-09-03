import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import {
  SPC_DAYS,
  SPC_TYPE_LABELS,
  TEMPERATURE_KIND_LABELS,
  spcTypesForDay,
  temperatureDaysForKind,
} from '../../config/outlooks'
import { STATE_BOUNDS } from '../../config/stateBounds'
import type { OutlookProduct, SpcDay, SpcOutlookType, TemperatureDay, TemperatureKind } from '../../types/outlooks'

type OutlookControlsProps = {
  product: OutlookProduct
  spcDay: SpcDay
  spcType: SpcOutlookType
  temperatureDay: TemperatureDay
  temperatureKind: TemperatureKind
  region: string
  onProductChange: (product: OutlookProduct) => void
  onSpcDayChange: (day: SpcDay) => void
  onSpcTypeChange: (type: SpcOutlookType) => void
  onTemperatureDayChange: (day: TemperatureDay) => void
  onTemperatureKindChange: (kind: TemperatureKind) => void
  onRegionChange: (region: string) => void
  onMyLocation: () => void
  onFullUs: () => void
}

const GROUP_SX = {
  flexShrink: 0,
  '& .MuiToggleButton-root': {
    px: { xs: 1.25, sm: 1.75 },
    py: 0.75,
    minHeight: 36,
    fontSize: { xs: '0.72rem', sm: '0.78rem' },
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
} as const

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        pb: 0.5,
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </Box>
  )
}

export function OutlookControls({
  product,
  spcDay,
  spcType,
  temperatureDay,
  temperatureKind,
  region,
  onProductChange,
  onSpcDayChange,
  onSpcTypeChange,
  onTemperatureDayChange,
  onTemperatureKindChange,
  onRegionChange,
  onMyLocation,
  onFullUs,
}: OutlookControlsProps) {
  const spcTypes = spcTypesForDay(spcDay)
  const temperatureDays = temperatureDaysForKind(temperatureKind)

  return (
    <Stack spacing={1.5}>
      <ScrollRow>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={product}
          aria-label="Outlook product"
          sx={GROUP_SX}
          onChange={(_, value: OutlookProduct | null) => {
            if (value) onProductChange(value)
          }}
        >
          <ToggleButton value="severe">Severe Weather</ToggleButton>
          <ToggleButton value="temperature">Temperatures</ToggleButton>
        </ToggleButtonGroup>
      </ScrollRow>

      {product === 'severe' ? (
        <>
          <ScrollRow>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={spcDay}
              aria-label="SPC forecast day"
              sx={GROUP_SX}
              onChange={(_, value: SpcDay | null) => {
                if (value) onSpcDayChange(value)
              }}
            >
              {SPC_DAYS.map((day) => (
                <ToggleButton key={day} value={day}>
                  Day {day}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </ScrollRow>

          <ScrollRow>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={spcType}
              aria-label="SPC outlook type"
              sx={GROUP_SX}
              onChange={(_, value: SpcOutlookType | null) => {
                if (value) onSpcTypeChange(value)
              }}
            >
              {spcTypes.map((type) => (
                <ToggleButton key={type} value={type}>
                  {SPC_TYPE_LABELS[type]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </ScrollRow>
        </>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <ScrollRow>
            <Stack direction="row" spacing={1.5} sx={{ width: 'max-content' }}>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={temperatureKind}
                aria-label="Temperature forecast type"
                sx={GROUP_SX}
                onChange={(_, value: TemperatureKind | null) => {
                  if (value) onTemperatureKindChange(value)
                }}
              >
                {(['high', 'low'] as TemperatureKind[]).map((kind) => (
                  <ToggleButton key={kind} value={kind}>
                    {TEMPERATURE_KIND_LABELS[kind]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <ToggleButtonGroup
                exclusive
                size="small"
                value={temperatureDay}
                aria-label="Temperature forecast day"
                sx={GROUP_SX}
                onChange={(_, value: TemperatureDay | null) => {
                  if (value) onTemperatureDayChange(value)
                }}
              >
                {temperatureDays.map((day) => (
                  <ToggleButton key={day} value={day}>
                    Day {day}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </ScrollRow>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 210 }, flexShrink: 0 }}>
            <InputLabel id="outlook-region-label">Region</InputLabel>
            <Select
              labelId="outlook-region-label"
              value={region}
              label="Region"
              onChange={(event) => onRegionChange(event.target.value)}
            >
              <MenuItem value="us">Contiguous US</MenuItem>
              {STATE_BOUNDS.map((state) => (
                <MenuItem key={state.code} value={state.code}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button size="small" variant="outlined" startIcon={<MyLocationRoundedIcon />} onClick={onMyLocation}>
          My location
        </Button>
        <Button size="small" variant="outlined" startIcon={<PublicRoundedIcon />} onClick={onFullUs}>
          Full US
        </Button>
      </Stack>
    </Stack>
  )
}
