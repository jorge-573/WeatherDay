import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel).attrs({ as: 'aside' })<TimeProps>`
  padding: 1.1rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`

export const Heading = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
`

export const Subheading = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
`

export const Menu = styled.nav`
  display: grid;
  gap: 0.5rem;
`

export const Item = styled.button<TimeProps & { $active?: boolean }>`
  border: 1px solid ${({ $active, $timeOfDay }) => ($active ? getCardTheme($timeOfDay).panelBorder : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.12)' : 'transparent')};
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
  padding: 0.6rem 0.7rem;
  border-radius: 14px;
  text-align: left;
  cursor: pointer;
  font: inherit;
`
