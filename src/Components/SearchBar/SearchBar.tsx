import { SearchIcon as SearchSvgIcon } from '../Icons'
import { SearchBox, SearchIcon, SearchInput } from './SearchBar.styles'

type SearchBarProps = {
  placeholder?: string
  ariaLabel?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchBar({
  placeholder = 'Search city...',
  ariaLabel = 'Search city',
  value,
  onChange,
}: SearchBarProps) {
  return (
    <SearchBox>
      <SearchIcon aria-hidden>
        <SearchSvgIcon />
      </SearchIcon>
      <SearchInput
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </SearchBox>
  )
}
