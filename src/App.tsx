import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

type TimeOfDay = 'night' | 'day' | 'sunrise' | 'sunset'

const BACKGROUNDS_BY_TIME: Record<TimeOfDay, string> = {
  night:
    'radial-gradient(circle at 80% 16%, rgba(36, 64, 92, 0.55), rgba(6, 16, 33, 0) 32%), linear-gradient(135deg, #041422 0%, #00344d 60%, #000c17 100%)',
  day: 'linear-gradient(135deg, #dff8ff 0%, #96e2ff 45%, #6dd3ff 100%)',
  sunrise:
    'radial-gradient(circle at 12% 16%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 32%), linear-gradient(135deg, #ffd06f 0%, #f2a04f 30%, #6f327d 68%, #2a1d39 100%)',
  sunset:
    'radial-gradient(circle at 88% 84%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 30%), linear-gradient(135deg, #2a1d39 0%, #6f327d 52%, #f2a04f 82%, #ffd06f 100%)',
}

const AppShell = styled.main<{ $background: string }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  background: ${({ $background }) => $background};
  transition: background 0.7s ease-in-out;
`

const OVERLAY_BY_TIME: Record<TimeOfDay, string> = {
  night: 'rgba(0, 0, 0, 0.25)',
  day: 'rgba(255, 255, 255, 0.1)',
  sunrise: 'rgba(0, 0, 0, 0.12)',
  sunset: 'rgba(0, 0, 0, 0.12)',
}

const Overlay = styled.div<{ $timeOfDay: TimeOfDay }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  box-sizing: border-box;
  background: ${({ $timeOfDay }) => OVERLAY_BY_TIME[$timeOfDay]};
`

const Content = styled.div<{ $isDay: boolean }>`
  text-align: center;
  width: min(700px, 92vw);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 38px rgba(0, 0, 0, 0.25);
  color: ${({ $isDay }) => ($isDay ? '#0f3550' : '#f4f8ff')};
  background: ${({ $isDay }) => ($isDay ? 'rgba(235, 250, 255, 0.55)' : 'rgba(14, 26, 46, 0.35)')};
`

const Label = styled.p`
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.8;
`

const Title = styled.h1`
  margin: 0.4rem 0 0;
  font-size: clamp(2rem, 8vw, 3.6rem);
  line-height: 1.05;
`

const Note = styled.p`
  margin: 0.85rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
`

function getTimeOfDay(now: Date): TimeOfDay {
  const hour = now.getHours()

  if (hour >= 6 && hour < 9) {
    return 'sunrise'
  }

  if (hour >= 18 && hour < 21) {
    return 'sunset'
  }

  if (hour >= 9 && hour < 18) {
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
  const isDay = timeOfDay === 'day'
  const displayTimeOfDay = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)

  return (
    <AppShell $background={activeBackground}>
      <Overlay $timeOfDay={timeOfDay}>
        <Content $isDay={isDay}>
          <Label>Current background</Label>
          <Title>{displayTimeOfDay}</Title>
          <Note>
            Background changes automatically by local time.
            <br />
            Weather-based background logic can now be plugged into the placeholder in `App.tsx`.
          </Note>
        </Content>
      </Overlay>
    </AppShell>
  )
}

export default App
