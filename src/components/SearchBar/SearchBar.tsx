import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useCitySearch } from '../../hooks/useCitySearch'
import type { GeocodingResult } from '../../types/weather'
import { SearchIcon as SearchSvgIcon } from '../Icons'
import {
  Dropdown,
  DropdownItem,
  DropdownItemSubtitle,
  DropdownItemTitle,
  DropdownStatus,
  Root,
  SearchBox,
  SearchIcon,
  SearchInput,
} from './SearchBar.styles'

type SearchBarProps = {
  placeholder?: string
  ariaLabel?: string
  onCitySelect?: (city: GeocodingResult) => void
}

export function SearchBar({ placeholder = 'Search city...', ariaLabel = 'Search city', onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const { results, loading, error } = useCitySearch(query)
  const trimmed = query.trim()
  const showDropdown = open && trimmed.length >= 2

  useEffect(() => {
    setHighlightedIndex(0)
  }, [results])

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelect(city: GeocodingResult) {
    onCitySelect?.(city)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (results.length === 0) return
      setOpen(true)
      setHighlightedIndex((prev) => (prev + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (results.length === 0) return
      setOpen(true)
      setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      const selected = results[highlightedIndex]
      if (selected) {
        event.preventDefault()
        handleSelect(selected)
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <Root ref={rootRef}>
      <SearchBox>
        <SearchIcon aria-hidden>
          <SearchSvgIcon />
        </SearchIcon>
        <SearchInput
          placeholder={placeholder}
          aria-label={ariaLabel}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
      </SearchBox>
      {showDropdown && (
        <Dropdown role="listbox">
          {loading && <DropdownStatus>Searching…</DropdownStatus>}
          {!loading && error && <DropdownStatus>Search failed</DropdownStatus>}
          {!loading && !error && results.length === 0 && <DropdownStatus>No matches</DropdownStatus>}
          {!loading &&
            results.map((city, index) => {
              const subtitle = [city.admin1, city.country].filter(Boolean).join(', ')
              const isActive = index === highlightedIndex
              return (
                <DropdownItem
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  role="option"
                  aria-selected={isActive}
                  $active={isActive}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    handleSelect(city)
                  }}
                >
                  <DropdownItemTitle>{city.name}</DropdownItemTitle>
                  {subtitle && <DropdownItemSubtitle>{subtitle}</DropdownItemSubtitle>}
                </DropdownItem>
              )
            })}
        </Dropdown>
      )}
    </Root>
  )
}
