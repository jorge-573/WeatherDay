import styled from 'styled-components'
import { backdropBlur } from '../../styles/mixins'
import { chrome, fontSize, radii } from '../../styles/tokens'

export const Root = styled.div`
  position: relative;
  display: inline-block;
  min-width: 220px;

  @media (max-width: 900px) {
    min-width: 170px;
  }
`

export const SearchBox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.42rem 0.9rem;
  border-radius: ${radii.pill};
  background: ${chrome.surface};
  border: 1px solid ${chrome.border};
  width: 100%;
`

export const SearchIcon = styled.span`
  display: inline-flex;
  color: ${chrome.textMuted};

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
  color: ${chrome.textBright};
  font: inherit;
  font-size: ${fontSize.meta};

  &::placeholder {
    color: ${chrome.textDim};
  }
`

export const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.3rem;
  list-style: none;
  background: rgba(10, 20, 35, 0.92);
  border: 1px solid ${chrome.borderHover};
  border-radius: ${radii.tile};
  ${backdropBlur(14)}
  z-index: 20;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
`

export const DropdownItem = styled.li<{ $active?: boolean }>`
  padding: 0.55rem 0.7rem;
  border-radius: ${radii.tile};
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  display: flex;
  flex-direction: column;
  transition: background 0.12s ease;
`

export const DropdownItemTitle = styled.span`
  color: ${chrome.textBright};
  font-size: ${fontSize.body};
  font-weight: 600;
`

export const DropdownItemSubtitle = styled.span`
  color: ${chrome.textMuted};
  font-size: ${fontSize.label};
  margin-top: 0.1rem;
`

export const DropdownStatus = styled.li`
  padding: 0.55rem 0.7rem;
  color: ${chrome.textMuted};
  font-size: ${fontSize.meta};
  list-style: none;
`
