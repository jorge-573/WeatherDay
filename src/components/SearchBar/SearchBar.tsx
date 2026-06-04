import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import { useCitySearch } from '../../hooks/useCitySearch'
import type { GeocodingResult } from '../../types/weather'

type SearchBarProps = {
  placeholder?: string
  onCitySelect?: (city: GeocodingResult) => void
}

function optionLabel(city: GeocodingResult): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(', ')
}

export function SearchBar({ placeholder = 'Search city...', onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useCitySearch(query)

  return (
    <Autocomplete<GeocodingResult>
      options={results}
      loading={loading}
      filterOptions={(options) => options}
      getOptionLabel={optionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={query.trim().length < 2 ? 'Type to search' : 'No matches'}
      onInputChange={(_, value) => setQuery(value)}
      onChange={(_, city) => {
        if (city) onCitySelect?.(city)
      }}
      value={null}
      blurOnSelect
      clearOnBlur
      sx={{ width: { xs: '100%', sm: 260 } }}
      renderOption={(props, option) => {
        const { key, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>
        const subtitle = [option.admin1, option.country].filter(Boolean).join(', ')
        return (
          <li key={key} {...rest}>
            <span>
              <Typography component="span" sx={{ fontWeight: 600 }}>
                {option.name}
              </Typography>
              {subtitle && (
                <Typography component="span" sx={{ color: 'text.secondary', ml: 0.75, fontSize: '0.85em' }}>
                  {subtitle}
                </Typography>
              )}
            </span>
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 9999,
              backgroundColor: (theme) => theme.md3.surfaceContainerHigh,
            },
          }}
        />
      )}
    />
  )
}
