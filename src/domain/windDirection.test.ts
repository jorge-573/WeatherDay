import { describe, expect, it } from 'vitest'
import { bearingToCompass, formatWindFrom } from './windDirection'

describe('bearingToCompass', () => {
  it('maps bearings to the nearest of 16 points', () => {
    expect(bearingToCompass(0)).toBe('N')
    expect(bearingToCompass(22.5)).toBe('NNE')
    expect(bearingToCompass(90)).toBe('E')
    expect(bearingToCompass(225)).toBe('SW')
    expect(bearingToCompass(348)).toBe('NNW')
  })

  it('wraps bearings outside 0-360', () => {
    expect(bearingToCompass(360)).toBe('N')
    expect(bearingToCompass(355)).toBe('N')
    expect(bearingToCompass(-90)).toBe('W')
    expect(bearingToCompass(450)).toBe('E')
  })
})

describe('formatWindFrom', () => {
  it('includes the compass point and rounded, normalized degrees', () => {
    expect(formatWindFrom(225.4)).toBe('From SW · 225°')
    expect(formatWindFrom(-10)).toBe('From N · 350°')
  })
})
