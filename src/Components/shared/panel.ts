import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import type { TimeOfDay } from '../../types/timeOfDay'

export type TimeProps = { $timeOfDay: TimeOfDay }

export const GlassPanel = styled.section<TimeProps>`
  border-radius: 28px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  background: ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBackground};
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
  box-shadow: ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelShadow};
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
`
