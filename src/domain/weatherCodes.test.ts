import { describe, expect, it } from 'vitest'
import { getWeatherCondition } from './weatherCodes'

describe('getWeatherCondition', () => {
  it('maps known WMO codes', () => {
    expect(getWeatherCondition(0)).toEqual({ label: 'Clear', group: 'clear' })
    expect(getWeatherCondition(65)).toEqual({ label: 'Heavy Rain', group: 'rain', intensity: 'heavy' })
    expect(getWeatherCondition(95)).toEqual({ label: 'Thunderstorm', group: 'thunder' })
  })

  it('falls back to Unknown for unmapped codes', () => {
    expect(getWeatherCondition(42)).toEqual({ label: 'Unknown', group: 'cloudy' })
  })
})
