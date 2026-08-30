import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import { useCitySearch } from '../../hooks/useCitySearch'
import { radii } from '../../theme'
import type { GeocodingResult } from '../../types/weather'
import { formatCityLabel } from '../../utils/formatCityLabel'
import { CurrentLocationOptionContent } from './CurrentLocationOption'
import { CURRENT_LOCATION_OPTION, isCurrentLocationOption, type SearchOption } from './searchOptions'

type SearchBarProps = {
  placeholder?: string
  onSearchSelect?: (city: GeocodingResult) => void
  onCurrentLocationClick?: () => void
  locating?: boolean
  locateError?: string | null
}

export function SearchBar({
  placeholder = 'Search city',
  onSearchSelect,
  onCurrentLocationClick,
  locating = false,
  locateError = null,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useCitySearch(query)

  return (
    <Box
      sx={{
        minWidth: 0,
        flex: { xs: 1, sm: '0 1 300px' },
        width: { sm: 300 },
        maxWidth: '100%',
      }}
    >
      <Autocomplete<SearchOption>
        fullWidth
        openOnFocus
        options={results}
        loading={loading}
        filterOptions={(options) => [CURRENT_LOCATION_OPTION, ...options]}
        getOptionLabel={(option) => (isCurrentLocationOption(option) ? option.name : formatCityLabel(option))}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionDisabled={(option) => isCurrentLocationOption(option) && locating}
        noOptionsText={query.trim().length < 2 ? 'Type to search' : 'No matches'}
        onInputChange={(_, value, reason) => {
          if (reason === 'input' || reason === 'clear') setQuery(value)
        }}
        onChange={(_, option) => {
          if (!option) return
          setQuery('')
          if (isCurrentLocationOption(option)) {
            onCurrentLocationClick?.()
            return
          }
          onSearchSelect?.(option)
        }}
        value={null}
        blurOnSelect
        clearOnBlur
        sx={{ minWidth: 0 }}
        renderOption={(props, option) => {
          const { key, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>
          if (isCurrentLocationOption(option)) {
            return (
              <li key={key} {...rest}>
                <CurrentLocationOptionContent locating={locating} error={locateError} />
              </li>
            )
          }

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
                borderRadius: radii.full,
                backgroundColor: (theme) => theme.md3.surfaceContainerHigh,
              },
            }}
          />
        )}
      />
    </Box>
  )
}
