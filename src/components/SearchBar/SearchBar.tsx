import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import SearchIcon from '@mui/icons-material/Search'
import { useCitySearch } from '../../hooks/useCitySearch'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import type { CitySource } from '../../hooks/useSelectedCity'
import type { GeocodingResult } from '../../types/weather'

type SearchBarProps = {
  placeholder?: string
  onCitySelect?: (city: GeocodingResult, source: CitySource) => void
}

function optionLabel(city: GeocodingResult): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(', ')
}

export function SearchBar({ placeholder = 'Search city...', onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const { results, loading } = useCitySearch(query)
  const {
    loading: locating,
    error: locateError,
    requestLocation,
  } = useCurrentLocation((city) => onCitySelect?.(city, 'geolocation'))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: { xs: '100%', sm: 300 } }}>
      <Autocomplete<GeocodingResult>
        options={results}
        loading={loading}
        filterOptions={(options) => options}
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText={query.trim().length < 2 ? 'Type to search' : 'No matches'}
        onInputChange={(_, value) => setQuery(value)}
        onChange={(_, city) => {
          if (city) onCitySelect?.(city, 'search')
        }}
        value={null}
        blurOnSelect
        clearOnBlur
        sx={{ flex: 1, minWidth: 0 }}
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

      <Tooltip title={locateError ?? 'Use current location'}>
        <span>
          <IconButton
            aria-label="Use current location"
            onClick={requestLocation}
            disabled={locating}
            size="small"
            sx={{
              color: locateError ? 'error.main' : 'text.secondary',
              backgroundColor: (theme) => theme.md3.surfaceContainerHigh,
              '&:hover': { backgroundColor: (theme) => theme.md3.surfaceContainerHighest },
            }}
          >
            {locating ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
