import type { TimeOfDay } from '../types/timeOfDay'

function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 9) return 'sunrise'
  if (hour >= 18 && hour < 21) return 'sunset'
  if (hour >= 9 && hour < 18) return 'day'
  return 'night'
}

export function getTimeOfDay(now: Date): TimeOfDay {
  return timeOfDayFromHour(now.getHours())
}

// Open-Meteo (with timezone=auto) returns timestamps already in the location's
// local time, e.g. "2026-05-31T21:30". Parse the hour directly so we reflect the
// looked-up location's time of day rather than the user's browser time.
export function getTimeOfDayFromLocalISO(localISO: string): TimeOfDay {
  const match = /T(\d{2}):/.exec(localISO)
  if (!match) return getTimeOfDay(new Date())
  return timeOfDayFromHour(Number(match[1]))
}

export function formatTimeOfDayLabel(timeOfDay: TimeOfDay): string {
  return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
}
