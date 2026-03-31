import { useEffect, useMemo, useState } from 'react'
import dayBackground from './assets/backgrounds/day.png'
import nightBackground from './assets/backgrounds/night.png'
import sunriseSunsetBackground from './assets/backgrounds/sunrise-sunset.png'
import './App.css'

type TimeOfDay = 'night' | 'day' | 'sunrise-sunset'

const BACKGROUNDS_BY_TIME: Record<TimeOfDay, string> = {
  night: nightBackground,
  day: dayBackground,
  'sunrise-sunset': sunriseSunsetBackground,
}

function getTimeOfDay(now: Date): TimeOfDay {
  const hour = now.getHours()

  if ((hour >= 6 && hour < 9) || (hour >= 18 && hour < 21)) {
    return 'sunrise-sunset'
  }

  if (true) {
    return 'day'
  }

  return 'night'
}

function App() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay(new Date()))

  useEffect(() => {
    const updateTimeOfDay = () => {
      setTimeOfDay(getTimeOfDay(new Date()))
    }

    updateTimeOfDay()
    const timer = window.setInterval(updateTimeOfDay, 60_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  // This will be replaced by weather-specific backgrounds later.
  const weatherBackgroundOverride: string | null = null

  const activeBackground = useMemo(() => {
    return weatherBackgroundOverride ?? BACKGROUNDS_BY_TIME[timeOfDay]
  }, [timeOfDay, weatherBackgroundOverride])

  return (
    <main
      className={`app app--${timeOfDay}`}
      style={{ backgroundImage: `url(${activeBackground})` }}
    >
      <div className="app__overlay">
        <div className="app__content">
          <p className="app__label">Current background</p>
          <h1 className="app__title">{timeOfDay.replace('-', ' / ')}</h1>
          <p className="app__note">
            Background changes automatically by local time.
            <br />
            Weather-based background logic can now be plugged into the placeholder in `App.tsx`.
          </p>
        </div>
      </div>
    </main>
  )
}

export default App
