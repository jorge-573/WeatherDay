import styled from 'styled-components'
import { GlassPanel } from '../shared/panel'

export const Wrapper = styled(GlassPanel)`
  position: relative;
  padding: 1.25rem;
  display: flex;
  min-height: 230px;
  overflow: hidden;
`

export const Summary = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  max-width: 55%;

  @media (max-width: 760px) {
    max-width: 100%;
  }
`

export const City = styled.p`
  margin-bottom: 1rem;
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

export const MetaTag = styled.span`
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.panelBorder};
  padding: 0.3rem 0.8rem;
  font-size: 0.84rem;
  color: ${({ theme }) => theme.textMuted};
  background: rgba(255, 255, 255, 0.18);
`

type VisualProps = {
  $backgroundImage?: string
}

export const Visual = styled.div<VisualProps>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  color: ${({ theme }) => theme.textPrimary};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${({ $backgroundImage }) => ($backgroundImage ? `url(${$backgroundImage})` : 'none')};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 35%,
      rgba(0, 0, 0, 0.75) 65%,
      rgba(0, 0, 0, 1) 100%
    );
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 35%,
      rgba(0, 0, 0, 0.75) 65%,
      rgba(0, 0, 0, 1) 100%
    );
  }
`
