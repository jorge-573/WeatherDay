import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel)<TimeProps>`
  padding: 1.2rem;
`

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
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

export const Item = styled.div<TimeProps & { $active?: boolean }>`
  border-radius: 14px;
  border: 1px solid ${({ $timeOfDay, $active }) => ($active ? getCardTheme($timeOfDay).panelBorder : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.16)' : 'transparent')};
  padding: 0.65rem 0.45rem;
  text-align: center;
  min-height: 94px;
`

export const Label = styled.p`
  margin: 0;
  font-size: 0.84rem;
  opacity: 0.84;
`

export const Temp = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 600;
`
