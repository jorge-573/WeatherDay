import type { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'

type StatusMessageProps = PropsWithChildren<{
  /** Compact form for use inside a panel, without the page-level vertical padding. */
  inline?: boolean
}>

/** Centered loading, error, or empty-state text. */
export function StatusMessage({ children, inline = false }: StatusMessageProps) {
  return (
    <Typography
      variant={inline ? 'body2' : 'body1'}
      sx={{ textAlign: 'center', color: 'text.secondary', py: inline ? 0 : 8 }}
    >
      {children}
    </Typography>
  )
}
