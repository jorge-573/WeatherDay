import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { WeatherStats } from '../../types/weather'

const CENTER = 50
const RING_RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
const HIGHLIGHT_ARC = CIRCUMFERENCE / 18 // 20° of the ring

type WindDialProps = {
  wind: WeatherStats['wind']
}

export function WindDial({ wind }: WindDialProps) {
  const theme = useTheme()
  const isCalm = wind.value === 0
  const heading = (wind.bearing + 180) % 360

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: { xs: 84, sm: 94 },
        height: { xs: 94, sm: 105 },
        flexShrink: 0,
      }}
    >
      <Typography
        component="span"
        variant="caption"
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'text.secondary',
          fontSize: 8,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        N
      </Typography>

      <Box
        component="svg"
        viewBox="0 0 100 100"
        sx={{ position: 'absolute', top: '10%', left: 0, width: '100%', height: 'auto' }}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke={theme.md3.outlineVariant}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeDasharray="1.5 4.5"
          opacity={0.65}
        />

        {!isCalm && (
          <>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RING_RADIUS}
              fill="none"
              stroke={theme.md3.accent}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${HIGHLIGHT_ARC} ${CIRCUMFERENCE - HIGHLIGHT_ARC}`}
              transform={`rotate(${heading - 100} ${CENTER} ${CENTER})`}
            />
            <g transform={`rotate(${heading} ${CENTER} ${CENTER})`}>
              <circle cx={CENTER} cy={CENTER - RING_RADIUS} r={3.25} fill={theme.md3.accent} />
            </g>
          </>
        )}
      </Box>

      {!isCalm && (
        <NavigationRoundedIcon
          sx={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            color: (t) => t.md3.accent,
            fontSize: { xs: 75, sm: 80 },
            transform: `translate(-50%, -50%) rotate(${heading}deg)`,
          }}
        />
      )}
    </Box>
  )
}
