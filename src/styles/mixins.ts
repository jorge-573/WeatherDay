import { css } from 'styled-components'

export const backdropBlur = (px: number) => css`
  backdrop-filter: blur(${px}px) saturate(140%);
  -webkit-backdrop-filter: blur(${px}px) saturate(140%);
`
