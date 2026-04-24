import type { TimeOfDay } from '../../types/timeOfDay'
import {
  Actions,
  Brand,
  IconButton,
  Link,
  Nav,
  SearchBox,
  SearchIcon,
  SearchInput,
  Wrapper,
} from './Header.styles'

type HeaderProps = {
  timeOfDay: TimeOfDay
}

const links = ['Forecast', 'Maps', 'Air Quality', 'History']
const activeLink = 'Forecast'

export function Header({ timeOfDay }: HeaderProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Brand>WeatherDay</Brand>

      <Nav>
        {links.map((entry) => (
          <Link
            key={entry}
            href="#"
            $timeOfDay={timeOfDay}
            data-active={entry === activeLink}
          >
            {entry}
          </Link>
        ))}
      </Nav>

      <Actions>
        <SearchBox>
          <SearchIcon aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </SearchIcon>
          <SearchInput placeholder="Search city..." aria-label="Search city" />
        </SearchBox>

        <IconButton type="button" aria-label="Set location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </IconButton>

        <IconButton type="button" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </IconButton>
      </Actions>
    </Wrapper>
  )
}
