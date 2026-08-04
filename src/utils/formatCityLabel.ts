import type { GeocodingResult } from '../types/weather'

/** Full place name, e.g. "Austin, Texas, United States". Omits parts the geocoder did not return. */
export function formatCityLabel(city: GeocodingResult): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(', ')
}
