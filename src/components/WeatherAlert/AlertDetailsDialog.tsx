import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import type { AlertSeverity, WeatherAlert as WeatherAlertData } from '../../types/weather'

type AlertDetailsDialogProps = {
  open: boolean
  alerts: WeatherAlertData[]
  onClose: () => void
}

const SEVERITY_CHIP: Record<AlertSeverity, { bg: string; fg: string }> = {
  extreme: { bg: 'errorContainer', fg: 'onErrorContainer' },
  severe: { bg: 'errorContainer', fg: 'onErrorContainer' },
  moderate: { bg: 'tertiaryContainer', fg: 'onTertiaryContainer' },
  minor: { bg: 'primaryContainer', fg: 'onPrimaryContainer' },
  unknown: { bg: 'surfaceVariant', fg: 'onSurfaceVariant' },
}

function formatDateTime(iso?: string): string | undefined {
  if (!iso) return undefined
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatUntil(alert: WeatherAlertData): string | undefined {
  const until = alert.expires ?? alert.ends
  if (!until) return undefined
  return `Until ${new Date(until).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

function severityLabel(severity: AlertSeverity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1)
}

function DetailField({ label, value, preLine }: { label: string; value: string; preLine?: boolean }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.08em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: preLine ? 'pre-line' : 'normal' }}>
        {value}
      </Typography>
    </Box>
  )
}

export function AlertDetailsDialog({ open, alerts, onClose }: AlertDetailsDialogProps) {
  const [expandedId, setExpandedId] = useState<string | undefined>(alerts[0]?.id)

  useEffect(() => {
    if (open) setExpandedId(alerts[0]?.id)
  }, [open, alerts])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle component="div" sx={{ pr: 6 }}>
        <Typography variant="h6" component="h2">
          Weather Alerts
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.5}>
          {alerts.map((alert) => {
            const chip = SEVERITY_CHIP[alert.severity]
            const until = formatUntil(alert)
            const effective = formatDateTime(alert.effective ?? alert.onset)
            const expires = formatDateTime(alert.expires ?? alert.ends)
            return (
              <Accordion
                key={alert.id}
                disableGutters
                elevation={0}
                expanded={expandedId === alert.id}
                onChange={(_, isExpanded) => setExpandedId(isExpanded ? alert.id : undefined)}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: (t) => t.md3.surfaceContainerHigh,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                    <Chip
                      label={severityLabel(alert.severity)}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        fontWeight: 700,
                        backgroundColor: (t) => t.md3[chip.bg as keyof typeof t.md3],
                        color: (t) => t.md3[chip.fg as keyof typeof t.md3],
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {alert.event}
                      </Typography>
                      {until && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {until}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    {alert.areaDesc && <DetailField label="Affected area" value={alert.areaDesc} />}
                    {(effective || expires) && (
                      <Stack direction="row" spacing={3}>
                        {effective && <DetailField label="Effective" value={effective} />}
                        {expires && <DetailField label="Expires" value={expires} />}
                      </Stack>
                    )}
                    {alert.description && <DetailField label="Details" value={alert.description} preLine />}
                    {alert.instruction && <DetailField label="What to do" value={alert.instruction} preLine />}
                    {alert.senderName && <DetailField label="Source" value={alert.senderName} />}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
