import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { searchCities } from '../services/openMeteo'
import type { GeocodingResult } from '../types/weather'
import { useDebouncedValue } from './useDebouncedValue'

const MIN_QUERY_LENGTH = 2
const STALE_TIME_MS = 60 * 60_000

type CitySearchState = {
  results: GeocodingResult[]
  loading: boolean
  error: string | null
}

export function useCitySearch(query: string): CitySearchState {
  const term = useDebouncedValue(query, 280).trim()
  const enabled = term.length >= MIN_QUERY_LENGTH

  const search = useQuery({
    queryKey: ['citySearch', term.toLowerCase()],
    queryFn: ({ signal }) => searchCities(term, signal),
    enabled,
    staleTime: STALE_TIME_MS,
    // Keep the last results visible while the next keystroke's search runs.
    placeholderData: keepPreviousData,
  })

  if (!enabled) return { results: [], loading: false, error: null }

  return {
    results: search.data ?? [],
    loading: search.isFetching,
    error: search.error ? search.error.message : null,
  }
}
