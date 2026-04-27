import styled from 'styled-components'

export const Wrapper = styled.footer`
  width: 100%;
  padding: 1.4rem clamp(1rem, 2.6vw, 2.25rem) 1.1rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(3, 8, 14, 0.82);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
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
  font-size: 0.88rem;
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
  color: rgba(235, 244, 255, 0.94);
`

export const Copyright = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: rgba(177, 194, 212, 0.6);
  text-align: center;
`
