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
import type { AlertSeverity, WeatherAlert as WeatherAlertData } from '../../types/weather'

type WeatherAlertProps = {
  alerts: WeatherAlertData[]
  rotateMs?: number
  onViewDetails?: (alert: WeatherAlertData) => void
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
  const until = alert.expires ?? alert.ends
  const untilLabel = until
    ? `Until ${new Date(until).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : undefined
  return [untilLabel, alert.areaDesc].filter(Boolean).join(' • ')
}

export function WeatherAlert({ alerts, rotateMs = 6000, onViewDetails }: WeatherAlertProps) {
  const sortedAlerts = useMemo(
    () => [...alerts].sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
    [alerts]
  )

  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
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
    if (count <= 1 || paused) return
    const id = window.setInterval(() => {
      nextIndexRef.current = (index + 1) % count
      setVisible(false)
    }, rotateMs)
    return () => window.clearInterval(id)
  }, [count, paused, index, rotateMs])

  if (count === 0) return null

  const currentAlert = sortedAlerts[index]
  const hasMultiple = count > 1

  return (
    <Stack
      spacing={1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.5,
        borderRadius: 3,
        backgroundColor: (t) => t.md3.errorContainer,
        color: (t) => t.md3.onErrorContainer,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
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
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {currentAlert.event}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }} noWrap>
                {formatAlertDetail(currentAlert)}
              </Typography>
            </Box>
          </Fade>
        </Box>

        {hasMultiple && (
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

        <Button
          variant="text"
          onClick={() => onViewDetails?.(currentAlert)}
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
      </Stack>

      {hasMultiple && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 5 }}>
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
      )}
    </Stack>
  )
}
