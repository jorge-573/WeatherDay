import type { TimeOfDay } from '../../types/timeOfDay'
import type { WeatherGroup } from '../../types/weather'
import clearDay from '../../assets/scenes/clear-day.webp'
import clearNight from '../../assets/scenes/clear-night.webp'
import cloudyDay from '../../assets/scenes/cloudy-day.webp'
import cloudyNight from '../../assets/scenes/cloudy-night.webp'
import rainDay from '../../assets/scenes/rain-day.webp'
import rainNight from '../../assets/scenes/rain-night.webp'
import snowDay from '../../assets/scenes/snow-day.webp'
import snowNight from '../../assets/scenes/snow-night.webp'
import thunderDay from '../../assets/scenes/thunder-day.webp'
import thunderNight from '../../assets/scenes/thunder-night.webp'
import fogDay from '../../assets/scenes/fog-day.webp'
import fogNight from '../../assets/scenes/fog-night.webp'

export type SceneBucket = 'day' | 'night'

export function toSceneBucket(timeOfDay: TimeOfDay): SceneBucket {
  return timeOfDay === 'night' ? 'night' : 'day'
}

// Curated illustration matrix: (day | night) x weather group. Structured so more
// time-of-day buckets (e.g. dawn/dusk variants) can be added without code changes.
const sceneMatrix: Record<SceneBucket, Record<WeatherGroup, string>> = {
  day: {
    clear: clearDay,
    cloudy: cloudyDay,
    rain: rainDay,
    snow: snowDay,
    thunder: thunderDay,
    fog: fogDay,
  },
  night: {
    clear: clearNight,
    cloudy: cloudyNight,
    rain: rainNight,
    snow: snowNight,
    thunder: thunderNight,
    fog: fogNight,
  },
}

export function getScene(group: WeatherGroup, timeOfDay: TimeOfDay): string {
  const bucket = toSceneBucket(timeOfDay)
  return sceneMatrix[bucket][group] ?? sceneMatrix[bucket].clear
}
