import styled from 'styled-components'
import { chrome, fontSize, radii } from '../../styles/tokens'

export const SearchBox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.42rem 0.9rem;
  border-radius: ${radii.pill};
  background: ${chrome.surface};
  border: 1px solid ${chrome.border};
  min-width: 220px;

  @media (max-width: 900px) {
    min-width: 170px;
  }
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
