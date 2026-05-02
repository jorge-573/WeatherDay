import styled from 'styled-components'
import { GlassPanel } from '../shared/panel'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const Card = styled(GlassPanel)`
  padding: 0.9rem;
`

export const Label = styled.p`
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.78;
`

export const Value = styled.p`
  margin: 0.35rem 0 0;
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
`

export const Subtext = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.93rem;
  opacity: 0.86;
`
