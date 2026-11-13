import { describe, expect, it } from 'vitest'
import { getTimeOfDay, getTimeOfDayFromLocalISO } from './getTimeOfDay'

describe('getTimeOfDayFromLocalISO', () => {
  it.each([
    ['2026-05-31T05:59', 'night'],
    ['2026-05-31T06:00', 'sunrise'],
    ['2026-05-31T09:00', 'day'],
    ['2026-05-31T17:59', 'day'],
    ['2026-05-31T18:00', 'sunset'],
    ['2026-05-31T21:30', 'night'],
  ])('%s is %s', (iso, expected) => {
    expect(getTimeOfDayFromLocalISO(iso)).toBe(expected)
  })
})

describe('getTimeOfDay', () => {
  it('uses the local hour of the date', () => {
    expect(getTimeOfDay(new Date(2026, 4, 31, 7))).toBe('sunrise')
  })
})
