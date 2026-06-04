import { BackgroundScene } from './components/BackgroundScene'
import { useCityLocation } from './hooks/useCityLocation'
import { useUnitPreference } from './hooks/useUnitPreference'
import { useWeather } from './hooks/useWeather'
import { Home } from './pages/Home'
import { getTimeOfDay } from './utils/getTimeOfDay'

function App() {
  const cityLocation = useCityLocation()
  const { units, setUnits } = useUnitPreference()
  const { data, loading, error } = useWeather(cityLocation.city, units)

  const timeOfDay = data?.timeOfDay ?? getTimeOfDay(new Date())

  return (
    <BackgroundScene timeOfDay={timeOfDay}>
      <Home
        data={data}
        loading={loading}
        error={error}
        units={units}
        cityLocation={cityLocation}
        onUnitChange={setUnits}
      />
    </BackgroundScene>
  )
}

export default App
