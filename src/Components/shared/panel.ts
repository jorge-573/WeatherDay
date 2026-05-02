import styled from 'styled-components'

export const GlassPanel = styled.section`
  border-radius: 28px;
  border: 1px solid ${({ theme }) => theme.panelBorder};
  background: ${({ theme }) => theme.panelBackground};
  color: ${({ theme }) => theme.textPrimary};
  box-shadow: ${({ theme }) => theme.panelShadow};
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
`
