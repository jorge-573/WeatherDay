import styled from 'styled-components'
import { backdropBlur } from '../../styles/mixins'
import { radii } from '../../styles/tokens'

export const GlassPanel = styled.section`
  border-radius: ${radii.card};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  background: ${({ theme }) => theme.panelBackground};
  color: ${({ theme }) => theme.textPrimary};
  box-shadow: ${({ theme }) => theme.panelShadow};
  ${backdropBlur(18)}
`
