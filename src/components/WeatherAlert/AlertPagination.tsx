import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { WeatherAlert } from '../../types/weather'

type AlertNavigationButtonsProps = {
  index: number
  onSelect: (index: number) => void
}

export function AlertNavigationButtons({ index, onSelect }: AlertNavigationButtonsProps) {
  return (
    <Stack direction="row" spacing={0.5}>
      <IconButton
        size="small"
        aria-label="Previous alert"
        onClick={() => onSelect(index - 1)}
        sx={{ color: 'inherit' }}
      >
        <ChevronLeftRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="Next alert" onClick={() => onSelect(index + 1)} sx={{ color: 'inherit' }}>
        <ChevronRightRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}

type AlertPaginationProps = AlertNavigationButtonsProps & {
  alerts: WeatherAlert[]
  showNavigation: boolean
}

export function AlertPagination({ alerts, index, onSelect, showNavigation }: AlertPaginationProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ pl: 5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack direction="row" spacing={0.25}>
          {alerts.map((alert, dotIndex) => (
            <IconButton
              key={`${alert.id}-${dotIndex}`}
              size="small"
              aria-label={`Show alert ${dotIndex + 1}`}
              aria-current={dotIndex === index ? 'true' : undefined}
              onClick={() => onSelect(dotIndex)}
              sx={{ p: 0.5, color: 'inherit' }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                  opacity: dotIndex === index ? 1 : 0.35,
                  transition: 'opacity 0.2s',
                }}
              />
            </IconButton>
          ))}
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {index + 1} of {alerts.length}
        </Typography>
      </Stack>

      {showNavigation && <AlertNavigationButtons index={index} onSelect={onSelect} />}
    </Stack>
  )
}
