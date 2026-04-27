import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`

export const Main = styled.main`
  width: 100%;
  max-width: 1760px;
  margin: 0 auto;
  padding: 1.25rem clamp(1rem, 2.6vw, 2.25rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.1rem;
  min-height: 0;

  @media (max-width: 1220px) {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

export const CenterColumn = styled.section`
  display: grid;
  gap: 1rem;
  min-width: 0;
`

export const RightColumn = styled.aside`
  display: grid;
  gap: 1rem;
  align-content: start;

  @media (max-width: 980px) {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
