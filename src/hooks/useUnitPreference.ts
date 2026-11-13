import { useEffect, useState } from 'react'
import type { UnitSystem } from '../config/units'
import { getPlatform } from '../platform'

const STORAGE_KEY = 'weatherday:units'

function readInitial(): UnitSystem {
  const stored = getPlatform().storage.getItem(STORAGE_KEY)
  return stored === 'metric' || stored === 'imperial' ? stored : 'imperial'
}

export function useUnitPreference() {
  const [units, setUnits] = useState<UnitSystem>(readInitial)

  useEffect(() => {
    getPlatform().storage.setItem(STORAGE_KEY, units)
  }, [units])

  return { units, setUnits }
}
