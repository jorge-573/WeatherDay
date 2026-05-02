import { ThemeProvider } from 'styled-components'
import { BackgroundScene } from './Components/BackgroundScene'
import { useTimeOfDay } from './hooks/useTimeOfDay'
import { Home } from './pages/Home'
import { getCardTheme } from './styles/theme'

function App() {
  const timeOfDay = useTimeOfDay()

  // This will be replaced by weather-specific backgrounds later.
  const weatherBackgroundOverride: string | null = null

  return (
    <ThemeProvider theme={getCardTheme(timeOfDay)}>
      <BackgroundScene timeOfDay={timeOfDay} weatherBackgroundOverride={weatherBackgroundOverride}>
        <Home />
      </BackgroundScene>
    </ThemeProvider>
  )
}

export default App
