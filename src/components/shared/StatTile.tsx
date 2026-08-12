import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Theme } from '@mui/material/styles'
import type { SvgIconComponent } from '@mui/icons-material'

type StatTileProps = {
  icon: SvgIconComponent
  label: string
  /** Headline reading. Null or undefined renders a muted placeholder. */
  value?: ReactNode
  /** Small suffix trailing the value, e.g. "mph". */
  unit?: string
  /** Muted supporting line, pinned to the bottom so tiles line up in a row. */
  detail?: ReactNode
  valueColor?: string | ((theme: Theme) => string)
  /** Replaces the value/unit block entirely, for tiles with a custom body. */
  children?: ReactNode
}

export function StatTile({ icon: Icon, label, value, unit, detail, valueColor, children }: StatTileProps) {
  const hasValue = value !== null && value !== undefined

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2.25 },
        height: '100%',
        minWidth: 0,
        minHeight: 132,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mb: 1.25 }}>
        <Icon sx={{ fontSize: 16 }} />
        <Typography
          variant="overline"
          component="h3"
          sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.4 }}
        >
          {label}
        </Typography>
      </Stack>

      {children ?? (
        <Typography
          variant="h4"
          component="p"
          sx={{ fontWeight: 700, lineHeight: 1.1, color: hasValue ? valueColor : 'text.disabled' }}
        >
          {hasValue ? value : '—'}
          {hasValue && unit && (
            <Box component="span" sx={{ ml: 0.5, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
              {unit}
            </Box>
          )}
        </Typography>
      )}

      {detail && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 'auto', pt: 1 }}>
          {detail}
        </Typography>
      )}
    </Paper>
  )
}
