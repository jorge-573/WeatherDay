import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type StatValueProps = {
  value: ReactNode | null | undefined
  unit?: string
}

export function StatValue({ value, unit }: StatValueProps) {
  const hasValue = value !== null && value !== undefined

  return (
    <Typography
      variant="h4"
      component="p"
      sx={{ fontWeight: 700, lineHeight: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
    >
      {hasValue ? value : '—'}
      {hasValue && unit && (
        <Box component="span" sx={{ ml: 0.5, fontSize: '0.5em', fontWeight: 600, color: 'text.secondary' }}>
          {unit}
        </Box>
      )}
    </Typography>
  )
}
