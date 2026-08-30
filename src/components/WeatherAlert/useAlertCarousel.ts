import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AlertSeverity, WeatherAlert } from '../../types/weather'

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  extreme: 0,
  severe: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
}

type AlertCarouselOptions = {
  rotateMs: number
  paused: boolean
}

export function useAlertCarousel(alerts: WeatherAlert[], { rotateMs, paused }: AlertCarouselOptions) {
  const sortedAlerts = useMemo(
    () => [...alerts].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]),
    [alerts]
  )
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const nextIndexRef = useRef(0)
  const count = sortedAlerts.length

  useEffect(() => {
    setIndex(0)
    nextIndexRef.current = 0
    setVisible(true)
  }, [count])

  const goTo = useCallback(
    (target: number) => {
      if (count === 0) return
      nextIndexRef.current = ((target % count) + count) % count
      setVisible(false)
    },
    [count]
  )

  const completeTransition = useCallback(() => {
    setIndex(nextIndexRef.current)
    setVisible(true)
  }, [])

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = window.setInterval(() => goTo(index + 1), rotateMs)
    return () => window.clearInterval(id)
  }, [count, paused, index, rotateMs, goTo])

  return {
    sortedAlerts,
    currentAlert: sortedAlerts[index],
    count,
    index,
    visible,
    goTo,
    completeTransition,
  }
}
