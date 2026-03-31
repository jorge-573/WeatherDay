import { useEffect, useState } from 'react'
import type { TimeOfDay } from '../types/timeOfDay'
import { getTimeOfDay } from '../utils/getTimeOfDay'

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay(new Date()))

  useEffect(() => {
    const updateTimeOfDay = () => {
      setTimeOfDay(getTimeOfDay(new Date()))
    }

    updateTimeOfDay()
    const timer = window.setInterval(updateTimeOfDay, 60_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return timeOfDay
}
