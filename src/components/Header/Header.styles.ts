import styled from 'styled-components'
import { backdropBlur } from '../../styles/mixins'
import { chrome, fontSize, pageGutter } from '../../styles/tokens'

export const Wrapper = styled.header`
  width: 100%;
  padding: 0.85rem ${pageGutter};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  background: ${chrome.headerBg};
  border-bottom: 1px solid ${chrome.surface};
  ${backdropBlur(14)}

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.75rem;
  }
`

export const Brand = styled.div`
  font-size: clamp(1.05rem, 1.2vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${chrome.textBrand};
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1.2rem;
  }

  @media (max-width: 760px) {
    flex-wrap: wrap;
    gap: 0.9rem;
  }
`

export const Link = styled.a`
  font-size: ${fontSize.body};
  text-decoration: none;
  color: ${chrome.textMuted};
  padding-bottom: 0.3rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${chrome.textBright};
    outline: none;
  }

  &[data-active='true'] {
    color: ${chrome.textBright};
    border-bottom-color: ${({ theme }) => theme.accent};
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  justify-self: end;

  @media (max-width: 760px) {
    justify-self: center;
    flex-wrap: wrap;
    justify-content: center;
  }
`
