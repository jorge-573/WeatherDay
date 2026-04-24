import styled from 'styled-components'

export const Wrapper = styled.footer`
  margin-top: 0.35rem;
  padding: 1.4rem 1.1rem 1rem;
  display: grid;
  justify-items: center;
  gap: 0.65rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(8, 16, 26, 0.95), rgba(3, 8, 14, 0.97));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
`

export const Links = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
`

export const Link = styled.a`
  text-decoration: none;
  font-size: 0.9rem;
  color: rgba(197, 210, 225, 0.72);
  transition: color 0.2s ease;

  &:hover {
    color: rgba(226, 238, 251, 0.94);
  }
`

export const Brand = styled.p`
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(235, 244, 255, 0.94);
`

export const Copyright = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: rgba(177, 194, 212, 0.64);
  text-align: center;
`
