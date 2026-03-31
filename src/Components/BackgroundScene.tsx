import { useMemo } from 'react'
import { BACKGROUNDS_BY_TIME } from '../config/backgrounds'
import {
  AppShell,
  Content,
  Label,
  Note,
  Overlay,
  Title,
} from '../styles/appLayout'
import type { TimeOfDay } from '../types/timeOfDay'
import { formatTimeOfDayLabel } from '../utils/getTimeOfDay'

type BackgroundSceneProps = {
  timeOfDay: TimeOfDay
  weatherBackgroundOverride?: string | null
}

export function BackgroundScene({
  timeOfDay,
  weatherBackgroundOverride = null,
}: BackgroundSceneProps) {
  const activeBackground = useMemo(() => {
    return weatherBackgroundOverride ?? BACKGROUNDS_BY_TIME[timeOfDay]
  }, [timeOfDay, weatherBackgroundOverride])

  const isDay = timeOfDay === 'day'
  const displayTimeOfDay = formatTimeOfDayLabel(timeOfDay)

  return (
    <AppShell $background={activeBackground}>
      <Overlay $timeOfDay={timeOfDay}>
        <Content $isDay={isDay}>
          <Label>Current background</Label>
          <Title>{displayTimeOfDay}</Title>
          <Note>
            Background changes automatically by local time.
            <br />
            Weather-based background logic can now be plugged into the placeholder in `App.tsx`.
          </Note>
        </Content>
      </Overlay>
    </AppShell>
  )
}
