import type { HourlyForecastEntry } from '../../types/weather'

export const hourlyForecastMock: HourlyForecastEntry[] = [
  { hour: 'Now', temperature: 72, isNow: true },
  { hour: '2 PM', temperature: 74 },
  { hour: '3 PM', temperature: 76 },
  { hour: '4 PM', temperature: 75 },
  { hour: '5 PM', temperature: 73 },
  { hour: '6 PM', temperature: 69 },
]
