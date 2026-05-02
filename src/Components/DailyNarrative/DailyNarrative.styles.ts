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

export const Paragraph = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  line-height: 1.45;
  opacity: 0.9;
`

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.panelBorder};
  margin: 0.9rem 0;
`
