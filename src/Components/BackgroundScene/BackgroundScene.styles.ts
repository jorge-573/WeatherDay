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
  padding: 1.2rem;
  background: ${({ $timeOfDay }) => appTheme.overlayByTime[$timeOfDay]};

  @media (max-width: 768px) {
    padding: 0.85rem;
  }
`

export const PageFrame = styled.div`
  width: min(1400px, 100%);
  min-height: calc(100vh - 2.4rem);
  margin: 0 auto;
  display: grid;
  grid-template-rows: 1fr;

  @media (max-width: 768px) {
    min-height: calc(100vh - 1.7rem);
  }
`
