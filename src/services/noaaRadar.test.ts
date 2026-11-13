import { describe, expect, it } from 'vitest'
import { findNoaaRegion } from './noaaRadar'

describe('findNoaaRegion', () => {
  it.each([
    [30.27, -97.74, 'conus'],
    [61.22, -149.9, 'alaska'],
    [21.31, -157.86, 'hawaii'],
    [18.47, -66.11, 'caribbean'],
    [13.44, 144.79, 'guam'],
  ])('(%f, %f) is %s', (lat, lng, expected) => {
    expect(findNoaaRegion(lat, lng)).toBe(expected)
  })

  it('returns null outside MRMS coverage', () => {
    expect(findNoaaRegion(51.5, -0.12)).toBeNull()
  })
})
