import styled from 'styled-components'
import { getCardTheme } from '../../styles/theme'
import type { TimeProps } from '../shared/panel'

export const Wrapper = styled.header<TimeProps>`
  width: 100%;
  padding: 0.85rem clamp(1rem, 2.6vw, 2.25rem);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  background: rgba(5, 12, 22, 0.62);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);

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

export const Link = styled.a<TimeProps>`
  font-size: 0.95rem;
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
    border-bottom-color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).accent};
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

export const SearchBox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 220px;

  @media (max-width: 900px) {
    min-width: 170px;
  }
`

export const SearchIcon = styled.span`
  display: inline-flex;
  color: rgba(214, 232, 248, 0.7);

  svg {
    width: 14px;
    height: 14px;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #eaf4ff;
  font: inherit;
  font-size: 0.88rem;

  &::placeholder {
    color: rgba(214, 232, 248, 0.55);
  }
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  color: rgba(214, 232, 248, 0.78);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #eaf4ff;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.14);
  }

  svg {
    width: 15px;
    height: 15px;
  }
`
