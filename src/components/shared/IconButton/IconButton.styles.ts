import styled from 'styled-components'
import { chrome } from '../../../styles/tokens'

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid ${chrome.border};
  background: ${chrome.surfaceSubtle};
  border-radius: 50%;
  color: ${chrome.textMuted};
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    color: ${chrome.textBright};
    background: ${chrome.surfaceHover};
    border-color: ${chrome.borderHover};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`
