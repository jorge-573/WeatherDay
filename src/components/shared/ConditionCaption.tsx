import type { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'

/** The short condition label under a forecast icon, e.g. "Partly Cloudy". */
export function ConditionCaption({ children }: PropsWithChildren) {
  return (
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.2, fontSize: '0.65rem' }}
    >
      {children}
    </Typography>
  )
}
