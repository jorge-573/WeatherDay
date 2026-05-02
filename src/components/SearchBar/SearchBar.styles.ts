import styled from 'styled-components'
import { fontSize, radii } from '../../styles/tokens'

export const SearchBox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.42rem 0.9rem;
  border-radius: ${radii.pill};
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
  font-size: ${fontSize.meta};

  &::placeholder {
    color: rgba(214, 232, 248, 0.55);
  }
`
