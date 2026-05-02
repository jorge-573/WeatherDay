import styled from 'styled-components'
import { backdropBlur } from '../../styles/mixins'
import { fontSize, pageGutter } from '../../styles/tokens'

export const Wrapper = styled.header`
  width: 100%;
  padding: 0.85rem ${pageGutter};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  background: rgba(5, 12, 22, 0.62);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
  color: rgba(235, 244, 255, 0.94);

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
  color: rgba(214, 232, 248, 0.72);
  padding-bottom: 0.3rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: #eaf4ff;
    outline: none;
  }

  &[data-active='true'] {
    color: #eaf4ff;
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
