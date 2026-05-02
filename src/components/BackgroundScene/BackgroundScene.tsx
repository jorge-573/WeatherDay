import type { PropsWithChildren } from 'react'
import { appTheme } from '../../styles/theme'
import type { TimeOfDay } from '../../types/timeOfDay'
import { AppShell, Overlay, PageFrame } from './BackgroundScene.styles'

type BackgroundSceneProps = PropsWithChildren<{
  timeOfDay: TimeOfDay
  weatherBackgroundOverride?: string | null
}>

export function BackgroundScene({
  children,
  timeOfDay,
  weatherBackgroundOverride = null,
}: BackgroundSceneProps) {
  const activeBackground =
    weatherBackgroundOverride ?? appTheme.backgroundsByTime[timeOfDay]

  return (
    <AppShell $background={activeBackground}>
      <Overlay $timeOfDay={timeOfDay}>
        <PageFrame>{children}</PageFrame>
      </Overlay>
    </AppShell>
  )
}
