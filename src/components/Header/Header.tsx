import LocationIcon from '@mui/icons-material/LocationOnOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import type { UnitSystem } from '../../config/units'
import type { GeocodingResult } from '../../types/weather'
import { SearchBar } from '../SearchBar'
import { UnitToggle } from '../UnitToggle'
import { IconButton } from '../shared/IconButton'
import { Actions, Brand, Link, Nav, Wrapper } from './Header.styles'

const links = ['Forecast', 'Maps', 'Air Quality', 'History']
const activeLink = 'Forecast'

type HeaderProps = {
  units: UnitSystem
  onCitySelect?: (city: GeocodingResult) => void
  onUnitChange: (units: UnitSystem) => void
}

export function Header({ units, onCitySelect, onUnitChange }: HeaderProps) {
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
        <UnitToggle units={units} onChange={onUnitChange} />
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
