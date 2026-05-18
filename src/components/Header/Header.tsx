import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import type { GeocodingResult } from '../../types/weather'
import { SearchBar } from '../SearchBar'
import { IconButton } from '../shared/IconButton'
import { Actions, Brand, Link, Nav, Wrapper } from './Header.styles'

const links = ['Forecast', 'Maps', 'Air Quality', 'History']
const activeLink = 'Forecast'

type HeaderProps = {
  onCitySelect?: (city: GeocodingResult) => void
}

export function Header({ onCitySelect }: HeaderProps) {
  return (
    <Wrapper>
      <Brand>WeatherDay</Brand>
      <Nav>
        {links.map((entry) => (
          <Link key={entry} href="#" data-active={entry === activeLink}>
            {entry}
          </Link>
        ))}
      </Nav>
      <Actions>
        <SearchBar onCitySelect={onCitySelect} />
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
