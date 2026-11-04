import { describe, expect, it } from 'vitest'
import { formatAlertDateTime, formatAlertUntil } from './formatAlertTime'
import type { WeatherAlert } from '../types/weather'

const ALERT: WeatherAlert = { id: 'a', event: 'Flood Warning', severity: 'severe' }

describe('formatAlertDateTime', () => {
  it('formats with weekday and time', () => {
    expect(formatAlertDateTime('2026-08-03T22:45:00Z')).toBe('Mon, Aug 3, 10:45 PM')
  })

  it('returns undefined without a timestamp', () => {
    expect(formatAlertDateTime(undefined)).toBeUndefined()
  })
})

describe('formatAlertUntil', () => {
  it('prefers expires over ends', () => {
    expect(formatAlertUntil({ ...ALERT, expires: '2026-08-04T06:00:00Z', ends: '2026-08-05T06:00:00Z' })).toBe(
      'Until Aug 4, 6:00 AM'
    )
  })

  it('falls back to ends, then undefined', () => {
    expect(formatAlertUntil({ ...ALERT, ends: '2026-08-05T18:30:00Z' })).toBe('Until Aug 5, 6:30 PM')
    expect(formatAlertUntil(ALERT)).toBeUndefined()
  })
})
