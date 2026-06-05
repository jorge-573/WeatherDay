import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

type WeatherAlertProps = {
  title: string
  detail: string
  onViewDetails?: () => void
}

export function WeatherAlert({ title, detail, onViewDetails }: WeatherAlertProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.5,
        borderRadius: 3,
        backgroundColor: (t) => t.md3.errorContainer,
        color: (t) => t.md3.onErrorContainer,
      }}
    >
      <WarningAmberRoundedIcon sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {detail}
        </Typography>
      </Box>
      <Button
        variant="text"
        onClick={onViewDetails}
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
  )
}
