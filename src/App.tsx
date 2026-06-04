import { useEffect } from 'react'
import { BackgroundScene } from './components/BackgroundScene'
import { useLocationOnStartup } from './hooks/useLocationOnStartup'
import { useSelectedCity } from './hooks/useSelectedCity'
import { useUnitPreference } from './hooks/useUnitPreference'
import { useWeather } from './hooks/useWeather'
import { Home } from './pages/Home'
import { fetchCurrentLocationCity } from './services/currentLocation'
import { getTimeOfDay } from './utils/getTimeOfDay'

function App() {
  const { city: selectedCity, isCurrentLocation, selectCity } = useSelectedCity()
  const { enabled: locationOnStartup, setEnabled: setLocationOnStartup } = useLocationOnStartup()
  const { units, setUnits } = useUnitPreference()
  const { data, loading, error } = useWeather(selectedCity, units)

  useEffect(() => {
    if (!locationOnStartup) return

    let cancelled = false
    fetchCurrentLocationCity()
      .then((city) => {
        if (!cancelled) selectCity(city, 'geolocation')
      })
      .catch(() => {
        // Keep last saved city if GPS or reverse geocode fails.
      })

    return () => {
      cancelled = true
    }
  }, [locationOnStartup, selectCity])

  const timeOfDay = data?.timeOfDay ?? getTimeOfDay(new Date())

  return (
    <BackgroundScene timeOfDay={timeOfDay}>
      <Home
        data={data}
        loading={loading}
        error={error}
        units={units}
        timeOfDay={timeOfDay}
        isCurrentLocation={isCurrentLocation}
        onCitySelect={selectCity}
        onUnitChange={setUnits}
        locationOnStartup={locationOnStartup}
        onLocationOnStartupChange={setLocationOnStartup}
      />
    </BackgroundScene>
  )
}

export default App
