import type { PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { backgroundsByTime, overlayByTime } from '../../theme/backgrounds'
import type { TimeOfDay } from '../../types/timeOfDay'

type BackgroundSceneProps = PropsWithChildren<{
  timeOfDay: TimeOfDay
}>

export function BackgroundScene({ children, timeOfDay }: BackgroundSceneProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: backgroundsByTime[timeOfDay],
        backgroundAttachment: 'fixed',
        transition: 'background-image 600ms ease',
      }}
    >
      <Box sx={{ minHeight: '100vh', backgroundColor: overlayByTime[timeOfDay] }}>{children}</Box>
    </Box>
  )
}
