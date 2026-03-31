import styled from 'styled-components'
import { OVERLAY_BY_TIME } from '../config/backgrounds'
import type { TimeOfDay } from '../types/timeOfDay'

export const AppShell = styled.main<{ $background: string }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  background: ${({ $background }) => $background};
  transition: background 0.7s ease-in-out;
`

export const Overlay = styled.div<{ $timeOfDay: TimeOfDay }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  box-sizing: border-box;
  background: ${({ $timeOfDay }) => OVERLAY_BY_TIME[$timeOfDay]};
`

export const Content = styled.div<{ $isDay: boolean }>`
  text-align: center;
  width: min(700px, 92vw);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 38px rgba(0, 0, 0, 0.25);
  color: ${({ $isDay }) => ($isDay ? '#0f3550' : '#f4f8ff')};
  background: ${({ $isDay }) => ($isDay ? 'rgba(235, 250, 255, 0.55)' : 'rgba(14, 26, 46, 0.35)')};
`

export const Label = styled.p`
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.8;
`

export const Title = styled.h1`
  margin: 0.4rem 0 0;
  font-size: clamp(2rem, 8vw, 3.6rem);
  line-height: 1.05;
`

export const Note = styled.p`
  margin: 0.85rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
`
