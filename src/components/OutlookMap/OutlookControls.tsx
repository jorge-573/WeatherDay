import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import { SPC_DAYS, SPC_TYPE_LABELS, spcTypesForDay } from '../../config/outlooks'
import type { SpcDay, SpcOutlookType } from '../../types/outlooks'

type OutlookControlsProps = {
  spcDay: SpcDay
  spcType: SpcOutlookType
  onSpcDayChange: (day: SpcDay) => void
  onSpcTypeChange: (type: SpcOutlookType) => void
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

function ScrollRow({ children }: { children: ReactNode }) {
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
  spcDay,
  spcType,
  onSpcDayChange,
  onSpcTypeChange,
  onMyLocation,
  onFullUs,
}: OutlookControlsProps) {
  const spcTypes = spcTypesForDay(spcDay)

  return (
    <Stack spacing={1.5}>
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
