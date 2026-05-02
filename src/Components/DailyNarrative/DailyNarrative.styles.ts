import styled from 'styled-components'
import { GlassPanel } from '../shared/panel'

export const Wrapper = styled(GlassPanel)`
  padding: 1.1rem;
`

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.panelBorder};
  margin: 0.9rem 0;
`
