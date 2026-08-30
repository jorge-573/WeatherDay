import type { GeocodingResult } from '../../types/weather'

const CURRENT_LOCATION_ID = 'current-location' as const

export type CurrentLocationSearchOption = {
  id: typeof CURRENT_LOCATION_ID
  name: string
}

export type SearchOption = GeocodingResult | CurrentLocationSearchOption

export const CURRENT_LOCATION_OPTION: CurrentLocationSearchOption = {
  id: CURRENT_LOCATION_ID,
  name: 'Use current location',
}

export function isCurrentLocationOption(option: SearchOption): option is CurrentLocationSearchOption {
  return option.id === CURRENT_LOCATION_ID
}
