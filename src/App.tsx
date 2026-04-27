import { BackgroundScene } from './Components/BackgroundScene'
import { useTimeOfDay } from './hooks/useTimeOfDay'
import { Home } from './pages/Home'

function App() {
  const timeOfDay = useTimeOfDay()

  // This will be replaced by weather-specific backgrounds later.
  const weatherBackgroundOverride: string | null = null

  return (
    <BackgroundScene timeOfDay={timeOfDay} weatherBackgroundOverride={weatherBackgroundOverride}>
      <Home timeOfDay={timeOfDay} />
    </BackgroundScene>
  )
}

export default App
