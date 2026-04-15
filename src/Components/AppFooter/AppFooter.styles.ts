import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel).attrs({ as: 'footer' })<TimeProps>`
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
`

export const Links = styled.nav`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`

export const Link = styled.a<TimeProps>`
  text-decoration: none;
  font-size: 0.9rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
`

export const Note = styled.p`
  margin: 0;
  font-size: 0.84rem;
  opacity: 0.8;
`
