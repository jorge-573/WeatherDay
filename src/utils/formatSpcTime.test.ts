import { describe, expect, it } from 'vitest'
import { formatSpcTime } from './formatSpcTime'

describe('formatSpcTime', () => {
  it('parses compact UTC timestamps (YYYYMMDDHHmm)', () => {
    expect(formatSpcTime('202606011630')).toBe('Jun 1, 4:30 PM UTC')
  })

  it('formats epoch milliseconds', () => {
    expect(formatSpcTime(Date.UTC(2026, 5, 1, 12, 0))).toBe('Jun 1, 12:00 PM UTC')
  })

  it('returns null for null and passes unparseable strings through', () => {
    expect(formatSpcTime(null)).toBeNull()
    expect(formatSpcTime('n/a')).toBe('n/a')
  })
})
