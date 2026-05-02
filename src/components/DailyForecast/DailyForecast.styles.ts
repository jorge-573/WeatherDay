import styled from 'styled-components'
import { fontSize, radii } from '../../styles/tokens'
import { GlassPanel } from '../shared/GlassPanel'

export const Wrapper = styled(GlassPanel)`
  padding: 1.1rem;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.panelBorder};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const Day = styled.p`
  margin: 0;
  font-size: ${fontSize.body};
`

export const Temperature = styled.p`
  margin: 0;
  font-size: ${fontSize.body};
  font-weight: 600;
`

export const Range = styled.div`
  width: 86px;
  height: 8px;
  border-radius: ${radii.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.accent},
    rgba(201, 84, 255, 0.8)
  );
`
