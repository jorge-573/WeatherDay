import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { AlertSeverity, WeatherAlert as WeatherAlertData } from '../../types/weather'
import { formatAlertUntil } from '../../utils/formatAlertTime'
import { AlertDetailsDialog } from './AlertDetailsDialog'

type WeatherAlertProps = {
  alerts: WeatherAlertData[]
  rotateMs?: number
}

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  extreme: 0,
  severe: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
}

function severityRank(severity: AlertSeverity) {
  return SEVERITY_RANK[severity]
}

function formatAlertDetail(alert: WeatherAlertData): string {
  return [formatAlertUntil(alert), alert.areaDesc].filter(Boolean).join(' • ')
}

export function WeatherAlert({ alerts, rotateMs = 6000 }: WeatherAlertProps) {
  const sortedAlerts = useMemo(
    () => [...alerts].sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
    [alerts]
  )

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useIsMobile()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const nextIndexRef = useRef(0)

  const count = sortedAlerts.length

  useEffect(() => {
    setIndex(0)
    nextIndexRef.current = 0
    setVisible(true)
  }, [count])

  const goTo = (target: number) => {
    nextIndexRef.current = ((target % count) + count) % count
    setVisible(false)
  }

  useEffect(() => {
    if (count <= 1 || paused || detailsOpen) return
    const id = window.setInterval(() => {
      nextIndexRef.current = (index + 1) % count
      setVisible(false)
    }, rotateMs)
    return () => window.clearInterval(id)
  }, [count, paused, detailsOpen, index, rotateMs])

  if (count === 0) return null

  const currentAlert = sortedAlerts[index]
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
          <Fade
            in={visible}
            timeout={reduceMotion ? 0 : 400}
            onExited={() => {
              setIndex(nextIndexRef.current)
              setVisible(true)
            }}
          >
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
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            <IconButton
              size="small"
              aria-label="Previous alert"
              onClick={() => goTo(index - 1)}
              sx={{ color: 'inherit' }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Next alert" onClick={() => goTo(index + 1)} sx={{ color: 'inherit' }}>
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
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

      {hasMultiple && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ pl: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={0.75}>
              {sortedAlerts.map((alert, dotIndex) => (
                <Box
                  key={`${alert.id}-${dotIndex}`}
                  role="button"
                  aria-label={`Show alert ${dotIndex + 1}`}
                  onClick={() => goTo(dotIndex)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundColor: 'currentColor',
                    opacity: dotIndex === index ? 1 : 0.35,
                    transition: 'opacity 0.2s',
                  }}
                />
              ))}
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {index + 1} of {count}
            </Typography>
          </Stack>
          {isMobile && (
            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                aria-label="Previous alert"
                onClick={() => goTo(index - 1)}
                sx={{ color: 'inherit' }}
              >
                <ChevronLeftRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Next alert"
                onClick={() => goTo(index + 1)}
                sx={{ color: 'inherit' }}
              >
                <ChevronRightRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}

      <AlertDetailsDialog open={detailsOpen} alerts={sortedAlerts} onClose={() => setDetailsOpen(false)} />
    </Stack>
  )
}
