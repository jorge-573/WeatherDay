import styled from 'styled-components'
import { GlassPanel } from '../shared/panel'

export const Wrapper = styled(GlassPanel)`
  padding: 1.1rem;
`

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
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
  font-size: 0.95rem;
`

export const Temp = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

export const Range = styled.div`
  width: 86px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.accent},
    rgba(201, 84, 255, 0.8)
  );
`
