import { LocationIcon, SettingsIcon } from '../Icons'
import { SearchBar } from '../SearchBar'
import { IconButton } from '../shared/IconButton'
import {
  Actions,
  Brand,
  Link,
  Nav,
  Wrapper,
} from './Header.styles'

const links = ['Forecast', 'Maps', 'Air Quality', 'History']
const activeLink = 'Forecast'

export function Header() {
  return (
    <Wrapper>
      <Brand>WeatherDay</Brand>
      <Nav>
        {links.map((entry) => (
          <Link
            key={entry}
            href="#"
            data-active={entry === activeLink}
          >
            {entry}
          </Link>
        ))}
      </Nav>
      <Actions>
        <SearchBar />
        <IconButton type="button" aria-label="Set location">
          <LocationIcon />
        </IconButton>
        <IconButton type="button" aria-label="Settings">
          <SettingsIcon />
        </IconButton>
      </Actions>
    </Wrapper>
  )
}
