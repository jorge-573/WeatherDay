import Box from '@mui/material/Box'
import { sceneBrightnessByTime } from '../../theme/backgrounds'
import type { TimeOfDay } from '../../types/timeOfDay'
import type { WeatherGroup } from '../../types/weather'
import { getScene } from './scenes'

type WeatherSceneProps = {
  group: WeatherGroup
  timeOfDay: TimeOfDay
  condition: string
}

export function WeatherScene({ group, timeOfDay, condition }: WeatherSceneProps) {
  const scene = getScene(group, timeOfDay)

  return (
    <Box
      role="img"
      aria-label={`${condition} weather scene`}
      sx={{
        width: '100%',
        height: 'clamp(150px, 22vw, 300px)',
        borderRadius: 'var(--scene-radius, 2rem)',
        overflow: 'hidden',
        backgroundImage: `url(${scene})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 65%',
        filter: `brightness(${sceneBrightnessByTime[timeOfDay]})`,
        boxShadow: '0 24px 48px rgba(2, 8, 20, 0.45)',
      }}
    />
  )
}
