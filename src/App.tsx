import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { BackgroundScene } from './components/BackgroundScene'
import { DEFAULT_CITY } from './config/defaultCity'
import { useTimeOfDay } from './hooks/useTimeOfDay'
import { useUnitPreference } from './hooks/useUnitPreference'
import { useWeather } from './hooks/useWeather'
import { Home } from './pages/Home'
import { getCardTheme } from './styles/theme'
import type { GeocodingResult } from './types/weather'

function App() {
  const timeOfDay = useTimeOfDay()
  const [selectedCity, setSelectedCity] = useState<GeocodingResult>(DEFAULT_CITY)
  const { units, setUnits } = useUnitPreference()
  const { data, loading, error } = useWeather(selectedCity, units)

  // This will be replaced by weather-specific backgrounds later.
  const weatherBackgroundOverride: string | null = null

  return (
    <ThemeProvider theme={getCardTheme(timeOfDay)}>
      <BackgroundScene timeOfDay={timeOfDay} weatherBackgroundOverride={weatherBackgroundOverride}>
        <Home
          data={data}
          loading={loading}
          error={error}
          units={units}
          onCitySelect={setSelectedCity}
          onUnitChange={setUnits}
        />
      </BackgroundScene>
    </ThemeProvider>
  )
}

export default App
