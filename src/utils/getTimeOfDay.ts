import type { TimeOfDay } from '../types/timeOfDay'

export function getTimeOfDay(now: Date): TimeOfDay {
  const hour = now.getHours()

  if (hour >= 6 && hour < 9) {
    return 'sunrise'
  }

  if (hour >= 18 && hour < 21) {
    return 'sunset'
  }

  if (hour >= 9 && hour < 18) {
    return 'day'
  }

  return 'night'
}

export function formatTimeOfDayLabel(timeOfDay: TimeOfDay): string {
  return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
}
