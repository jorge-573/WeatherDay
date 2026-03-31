import { BackgroundScene } from './Components/BackgroundScene'
import { useTimeOfDay } from './hooks/useTimeOfDay'

function App() {
  const timeOfDay = useTimeOfDay()

  // This will be replaced by weather-specific backgrounds later.
  const weatherBackgroundOverride: string | null = null

  return <BackgroundScene timeOfDay={timeOfDay} weatherBackgroundOverride={weatherBackgroundOverride} />
}

export default App
