import styled from 'styled-components'
import { fontSize, radii } from '../../styles/tokens'
import { GlassPanel } from '../shared/GlassPanel'

export const Wrapper = styled(GlassPanel)`
  padding: 1.2rem;
`

export const Row = styled.div`
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: repeat(6, minmax(70px, 1fr));
  gap: 0.6rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(3, minmax(70px, 1fr));
  }

  @media (max-width: 510px) {
    grid-template-columns: repeat(2, minmax(70px, 1fr));
  }
`

export const Item = styled.div<{ $active?: boolean }>`
  border-radius: ${radii.tile};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.panelBorder : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.16)' : 'transparent')};
  padding: 0.65rem 0.45rem;
  text-align: center;
  min-height: 94px;
`

export const Label = styled.p`
  margin: 0;
  font-size: ${fontSize.label};
  opacity: 0.84;
`

export const Temperature = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 600;
`
