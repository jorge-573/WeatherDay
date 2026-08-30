import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { WeatherAlert as WeatherAlertData } from '../../types/weather'
import { formatAlertUntil } from '../../utils/formatAlertTime'
import { AlertNavigationButtons, AlertPagination } from './AlertPagination'
import { AlertDetailsDialog } from './AlertDetailsDialog'
import { useAlertCarousel } from './useAlertCarousel'

type WeatherAlertProps = {
  alerts: WeatherAlertData[]
  rotateMs?: number
}

function formatAlertDetail(alert: WeatherAlertData): string {
  return [formatAlertUntil(alert), alert.areaDesc].filter(Boolean).join(' • ')
}

export function WeatherAlert({ alerts, rotateMs = 6000 }: WeatherAlertProps) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useIsMobile()
  const [paused, setPaused] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { sortedAlerts, currentAlert, count, index, visible, goTo, completeTransition } = useAlertCarousel(alerts, {
    rotateMs,
    paused: paused || detailsOpen,
  })

  if (!currentAlert) return null
  const hasMultiple = count > 1

  return (
    <Stack
      spacing={1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: 'relative',
        px: { xs: 1.5, md: 3 },
        py: 1.5,
        borderRadius: { xs: 2, sm: 3 },
        backgroundColor: (t) => t.md3.errorContainer,
        color: (t) => t.md3.onErrorContainer,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1.25, sm: 2 }}
        {...(isMobile
          ? {
              component: 'button' as const,
              type: 'button' as const,
              onClick: () => setDetailsOpen(true),
            }
          : {})}
        sx={{
          width: '100%',
          minWidth: 0,
          p: 0,
          border: 0,
          background: 'none',
          color: 'inherit',
          font: 'inherit',
          textAlign: 'left',
          cursor: { xs: 'pointer', sm: 'default' },
        }}
      >
        <WarningAmberRoundedIcon sx={{ flexShrink: 0 }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Fade in={visible} timeout={reduceMotion ? 0 : 400} onExited={completeTransition}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  ...(isMobile && {
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }),
                }}
                noWrap={!isMobile}
              >
                {currentAlert.event}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }} noWrap>
                {isMobile ? (formatAlertUntil(currentAlert) ?? 'Details available') : formatAlertDetail(currentAlert)}
              </Typography>
            </Box>
          </Fade>
        </Box>

        {hasMultiple && !isMobile && (
          <Box sx={{ flexShrink: 0 }}>
            <AlertNavigationButtons index={index} onSelect={goTo} />
          </Box>
        )}

        {isMobile ? (
          <ChevronRightRoundedIcon sx={{ flexShrink: 0 }} />
        ) : (
          <Button
            variant="text"
            onClick={() => setDetailsOpen(true)}
            sx={{
              flexShrink: 0,
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            View Details
          </Button>
        )}
      </Stack>

      {hasMultiple && <AlertPagination alerts={sortedAlerts} index={index} onSelect={goTo} showNavigation={isMobile} />}

      <AlertDetailsDialog open={detailsOpen} alerts={sortedAlerts} onClose={() => setDetailsOpen(false)} />
    </Stack>
  )
}
