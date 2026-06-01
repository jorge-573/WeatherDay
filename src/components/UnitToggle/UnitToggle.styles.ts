import styled from 'styled-components'
import { chrome, fontSize, radii } from '../../styles/tokens'

export const Toggle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.2rem;
  border-radius: ${radii.pill};
  background: ${chrome.surface};
  border: 1px solid ${chrome.border};
`

export const Option = styled.button<{ $active?: boolean }>`
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: ${fontSize.meta};
  line-height: 1;
  padding: 0.3rem 0.62rem;
  border-radius: ${radii.pill};
  color: ${({ $active }) => ($active ? chrome.textBright : chrome.textMuted)};
  background: ${({ $active }) => ($active ? chrome.surfaceHover : 'transparent')};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${chrome.textBright};
  }
`
