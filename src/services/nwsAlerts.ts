import type { AlertSeverity, WeatherAlert } from '../types/weather'

const NWS_ALERTS_URL = 'https://api.weather.gov/alerts/active'

type NwsAlertProperties = {
  id: string
  event: string
  headline?: string | null
  description?: string | null
  instruction?: string | null
  severity?: string | null
  areaDesc?: string | null
  onset?: string | null
  effective?: string | null
  expires?: string | null
  ends?: string | null
  senderName?: string | null
  messageType?: string | null
}

type NwsAlertFeature = {
  properties?: NwsAlertProperties
}

type NwsAlertsResponse = {
  features?: NwsAlertFeature[]
}

function toSeverity(value?: string | null): AlertSeverity {
  switch (value?.toLowerCase()) {
    case 'extreme':
      return 'extreme'
    case 'severe':
      return 'severe'
    case 'moderate':
      return 'moderate'
    case 'minor':
      return 'minor'
    default:
      return 'unknown'
  }
}

function nullableToUndefined(value?: string | null): string | undefined {
  return value ?? undefined
}

function mapAlert(properties: NwsAlertProperties): WeatherAlert {
  return {
    id: properties.id,
    event: properties.event,
    headline: nullableToUndefined(properties.headline),
    description: nullableToUndefined(properties.description),
    instruction: nullableToUndefined(properties.instruction),
    severity: toSeverity(properties.severity),
    areaDesc: nullableToUndefined(properties.areaDesc),
    onset: nullableToUndefined(properties.onset),
    effective: nullableToUndefined(properties.effective),
    expires: nullableToUndefined(properties.expires),
    ends: nullableToUndefined(properties.ends),
    senderName: nullableToUndefined(properties.senderName),
  }
}

/**
 * Active NWS alerts for a point. US-only; non-US points, network failures, and
 * non-OK responses resolve to an empty list so alerts never break the forecast.
 * Aborts are rethrown so the caller can ignore stale requests.
 */
export async function fetchAlerts(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherAlert[]> {
  // NWS rejects coordinates with more than 4 decimal places.
  const point = `${latitude.toFixed(4)},${longitude.toFixed(4)}`
  const url = new URL(NWS_ALERTS_URL)
  url.searchParams.set('point', point)
  url.searchParams.set('status', 'actual')

  let res: Response
  try {
    res = await fetch(url, { signal, headers: { Accept: 'application/geo+json' } })
  } catch (err) {
    if (signal?.aborted) throw err
    return []
  }

  if (!res.ok) return []

  const data = (await res.json()) as NwsAlertsResponse
  return (data.features ?? [])
    .map((feature) => feature.properties)
    .filter((properties): properties is NwsAlertProperties => Boolean(properties))
    .filter((properties) => properties.messageType !== 'Cancel')
    .map(mapAlert)
}
