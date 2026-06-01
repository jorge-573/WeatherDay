import { useCallback, useEffect, useState } from 'react'
import type { UnitSystem } from '../config/units'

const STORAGE_KEY = 'weatherday:units'

function readInitial(): UnitSystem {
  if (typeof window === 'undefined') return 'imperial'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'metric' || stored === 'imperial' ? stored : 'imperial'
}

export function useUnitPreference() {
  const [units, setUnits] = useState<UnitSystem>(readInitial)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, units)
  }, [units])

  const toggleUnits = useCallback(() => {
    setUnits((prev) => (prev === 'imperial' ? 'metric' : 'imperial'))
  }, [])

  return { units, setUnits, toggleUnits }
}
