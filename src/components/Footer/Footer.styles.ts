import styled from 'styled-components'
import { backdropBlur } from '../../styles/mixins'
import { chrome, fontSize, pageGutter } from '../../styles/tokens'

export const Wrapper = styled.footer`
  width: 100%;
  padding: 1.4rem ${pageGutter} 1.1rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  border-top: 1px solid ${chrome.surface};
  background: ${chrome.footerBg};
  ${backdropBlur(14)}
`

export const Links = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
`

export const Link = styled.a`
  text-decoration: none;
  font-size: ${fontSize.meta};
  color: rgba(197, 210, 225, 0.75);
  transition: color 0.2s ease;

  &:hover {
    color: rgba(226, 238, 251, 0.96);
  }
`

export const Brand = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${chrome.textBrand};
`

export const Copyright = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: rgba(177, 194, 212, 0.6);
  text-align: center;
`
