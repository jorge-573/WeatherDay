import { useState } from 'react'
import { BackgroundScene } from './components/BackgroundScene'
import { DEFAULT_CITY } from './config/defaultCity'
import { useUnitPreference } from './hooks/useUnitPreference'
import { useWeather } from './hooks/useWeather'
import { Home } from './pages/Home'
import type { GeocodingResult } from './types/weather'
import { getTimeOfDay } from './utils/getTimeOfDay'

function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult>(DEFAULT_CITY)
  const { units, setUnits } = useUnitPreference()
  const { data, loading, error } = useWeather(selectedCity, units)

  const timeOfDay = data?.timeOfDay ?? getTimeOfDay(new Date())

  return (
    <BackgroundScene timeOfDay={timeOfDay}>
      <Home
        data={data}
        loading={loading}
        error={error}
        units={units}
        timeOfDay={timeOfDay}
        onCitySelect={setSelectedCity}
        onUnitChange={setUnits}
      />
    </BackgroundScene>
  )
}

export default App
