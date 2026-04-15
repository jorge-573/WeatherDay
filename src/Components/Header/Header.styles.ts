import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel).attrs({ as: 'header' })<TimeProps>`
  padding: 0.95rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

export const Brand = styled.div`
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  font-weight: 700;
  letter-spacing: 0.015em;
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.1rem;

  @media (max-width: 760px) {
    gap: 0.6rem;
    flex-wrap: wrap;
  }
`

export const Link = styled.a<TimeProps>`
  font-size: 0.9rem;
  text-decoration: none;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: 0.2s ease-in-out;

  &:hover,
  &:focus-visible {
    color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
    border-bottom-color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).accent};
    outline: none;
  }
`

export const Actions = styled.div<TimeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  font-size: 0.84rem;
`
