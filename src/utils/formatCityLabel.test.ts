import { describe, expect, it } from 'vitest'
import { formatCityLabel } from './formatCityLabel'

describe('formatCityLabel', () => {
  it('joins name, region, and country', () => {
    expect(
      formatCityLabel({ id: 1, name: 'Austin', admin1: 'Texas', country: 'United States', latitude: 0, longitude: 0 })
    ).toBe('Austin, Texas, United States')
  })

  it('omits missing parts', () => {
    expect(formatCityLabel({ id: 2, name: 'Monaco', country: 'Monaco', latitude: 0, longitude: 0 })).toBe(
      'Monaco, Monaco'
    )
  })
})
