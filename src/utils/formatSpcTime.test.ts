import { describe, expect, it } from 'vitest'
import { formatSpcTime } from './formatSpcTime'

describe('formatSpcTime', () => {
  it('parses compact UTC timestamps (YYYYMMDDHHmm)', () => {
    expect(formatSpcTime('202606011630')).toBe('Jun 1, 4:30 PM UTC')
  })

  it('formats epoch milliseconds', () => {
    expect(formatSpcTime(Date.UTC(2026, 5, 1, 12, 0))).toBe('Jun 1, 12:00 PM UTC')
  })

  it('formats ISO strings', () => {
    expect(formatSpcTime('2026-06-01T12:00:00Z')).toBe('Jun 1, 12:00 PM UTC')
  })

  it('returns null for null and passes non-timestamp strings through', () => {
    expect(formatSpcTime(null)).toBeNull()
    expect(formatSpcTime('n/a')).toBe('n/a')
    expect(formatSpcTime('Day 1')).toBe('Day 1')
    expect(formatSpcTime('2026-13-45T99:00')).toBe('2026-13-45T99:00')
  })
})
