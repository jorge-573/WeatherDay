import styled from 'styled-components'
import { fontSize } from '../../styles/tokens'

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
`

export const Paragraph = styled.p`
  margin: 0.5rem 0 0;
  font-size: ${fontSize.body};
  line-height: 1.45;
  opacity: 0.9;
`
