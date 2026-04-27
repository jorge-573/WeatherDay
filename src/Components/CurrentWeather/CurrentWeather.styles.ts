import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import { GlassPanel, type TimeProps } from '../shared/panel'

export const Wrapper = styled(GlassPanel)<TimeProps>`
  padding: 1.25rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
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
  padding-right: 0.4rem;
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
  font-size: 1.4rem;
  font-weight: 600;
`

export const CurrentStateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
`

export const ConditionIconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5dcfff;
`

export const ConditionText = styled.div`
  display: grid;
  gap: 0.2rem;
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

type VisualProps = TimeProps & {
  $backgroundImage?: string
}

export const Visual = styled.div<VisualProps>`
  position: relative;
  margin: -1.25rem -1.25rem -1.25rem 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${({ $backgroundImage }) => ($backgroundImage ? `url(${$backgroundImage})` : 'none')};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.60;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, rgba(3, 10, 18, 0.1), rgba(3, 10, 18, 0.25));
  }

  > * {
    position: relative;
    z-index: 1;
  }
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
