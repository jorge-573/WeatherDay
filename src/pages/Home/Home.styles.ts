import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
`

export const Main = styled.main`
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 320px;
  gap: 1rem;
  min-height: 0;

  @media (max-width: 1220px) {
    grid-template-columns: 175px minmax(0, 1fr);
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

  @media (max-width: 1220px) {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
