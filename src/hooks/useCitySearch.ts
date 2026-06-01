import { useEffect, useState } from 'react'
import { searchCities } from '../services/openMeteo'
import type { GeocodingResult } from '../types/weather'
import { useDebouncedValue } from './useDebouncedValue'

type CitySearchState = {
  results: GeocodingResult[]
  loading: boolean
  error: string | null
}

const initialState: CitySearchState = { results: [], loading: false, error: null }

export function useCitySearch(query: string): CitySearchState {
  const debouncedQuery = useDebouncedValue(query, 280)
  const [state, setState] = useState<CitySearchState>(initialState)

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setState(initialState)
      return
    }

    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    searchCities(debouncedQuery, controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return
        setState({ results, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Search failed'
        setState({ results: [], loading: false, error: message })
      })

    return () => controller.abort()
  }, [debouncedQuery])

  return state
}
