import type { GeocodingResult } from '../types/weather'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
  country_code?: string
}

type NominatimResponse = {
  address?: NominatimAddress
}

function coordsId(latitude: number, longitude: number): number {
  return Math.abs(Math.round(latitude * 1e4) * 10000 + Math.round(longitude * 1e4)) || 1
}

function toGeocodingResult(latitude: number, longitude: number, address?: NominatimAddress): GeocodingResult {
  const name =
    address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? address?.county ?? 'Current location'

  return {
    id: coordsId(latitude, longitude),
    name,
    latitude,
    longitude,
    admin1: address?.state,
    country: address?.country,
    countryCode: address?.country_code?.toUpperCase(),
  }
}

/** Resolve coordinates to a city label (Open-Meteo has no reverse API; uses Nominatim). */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<GeocodingResult> {
  const url = new URL(NOMINATIM_URL)
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'en')

  const res = await fetch(url, {
    signal,
    headers: { 'User-Agent': 'WeatherDay/1.0 (local weather app)' },
  })

  if (!res.ok) {
    throw new Error('Could not resolve location name')
  }

  const data = (await res.json()) as NominatimResponse
  return toGeocodingResult(latitude, longitude, data.address)
}
