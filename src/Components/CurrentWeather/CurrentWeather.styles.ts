import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel)<TimeProps>`
  padding: 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(200px, 1fr);
  min-height: 230px;
  overflow: hidden;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  padding-right: 0.8rem;
`

export const City = styled.p`
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
`

export const Temperature = styled.p`
  margin: 0;
  font-size: clamp(2.9rem, 7vw, 5.1rem);
  line-height: 0.95;
  font-weight: 700;
`

export const Condition = styled.p`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`

export const MetaTag = styled.span<TimeProps>`
  border-radius: 999px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  padding: 0.3rem 0.8rem;
  font-size: 0.84rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  background: rgba(255, 255, 255, 0.18);
`

export const Visual = styled.div<TimeProps>`
  border-radius: 18px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.05));
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
`

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
`

export const Caption = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  line-height: 1.45;
  opacity: 0.9;
`
