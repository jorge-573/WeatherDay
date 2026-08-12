import type { AirQualityResponse } from '../types/openMeteo'

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

/**
 * Current air quality for a point. Lives on a different Open-Meteo host than the
 * forecast, so it is fetched separately; network failures and non-OK responses
 * resolve to null so air quality never breaks the forecast. Aborts are rethrown
 * so the caller can ignore stale requests.
 */
export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<AirQualityResponse | null> {
  const url = new URL(AIR_QUALITY_URL)
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set('current', 'us_aqi,pm2_5')
  url.searchParams.set('timezone', 'auto')

  let res: Response
  try {
    res = await fetch(url, { signal })
  } catch (err) {
    if (signal?.aborted) throw err
    return null
  }

  if (!res.ok) return null

  return (await res.json()) as AirQualityResponse
}
