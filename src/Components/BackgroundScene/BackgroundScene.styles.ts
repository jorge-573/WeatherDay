import styled from 'styled-components'
import { appTheme } from '../../styles/theme'
import type { TimeOfDay } from '../../types/timeOfDay'

export const AppShell = styled.div<{ $background: string }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  background: ${({ $background }) => $background};
  transition: background 0.7s ease-in-out;
  overflow: auto;
`

export const Overlay = styled.div<{ $timeOfDay: TimeOfDay }>`
  width: 100%;
  min-height: 100vh;
  background: ${({ $timeOfDay }) => appTheme.overlayByTime[$timeOfDay]};
`

export const PageFrame = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr;
`
