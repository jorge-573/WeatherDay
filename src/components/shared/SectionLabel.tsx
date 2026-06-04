import type { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <Typography
      variant="overline"
      component="h2"
      sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}
    >
      {children}
    </Typography>
  )
}
