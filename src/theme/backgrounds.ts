import type { TimeOfDay } from '../types/timeOfDay'

// Ambient page backdrop. The component palette stays a fixed dark MD3 scheme;
// only this gradient + overlay shift with the looked-up location's time of day.
export const backgroundsByTime: Record<TimeOfDay, string> = {
  night:
    'radial-gradient(circle at 80% 16%, rgba(36, 64, 92, 0.55), rgba(6, 16, 33, 0) 32%), linear-gradient(135deg, #041422 0%, #00344d 60%, #000c17 100%)',
  day: 'radial-gradient(circle at 78% 14%, rgba(120, 86, 160, 0.35), rgba(10, 15, 19, 0) 36%), linear-gradient(160deg, #123047 0%, #0e2336 52%, #0a0f13 100%)',
  sunrise:
    'radial-gradient(circle at 12% 16%, rgba(255, 214, 120, 0.22), rgba(255, 214, 120, 0) 32%), linear-gradient(160deg, #2a1d39 0%, #243a52 55%, #0a0f13 100%)',
  sunset:
    'radial-gradient(circle at 88% 84%, rgba(255, 214, 120, 0.2), rgba(255, 214, 120, 0) 30%), linear-gradient(160deg, #2a1d39 0%, #3a2742 48%, #0a0f13 100%)',
}

export const overlayByTime: Record<TimeOfDay, string> = {
  night: 'rgba(0, 0, 0, 0.28)',
  day: 'rgba(0, 0, 0, 0.12)',
  sunrise: 'rgba(0, 0, 0, 0.16)',
  sunset: 'rgba(0, 0, 0, 0.18)',
}

// Subtle extra dimming on top of the art (night scenes are already dark).
export const sceneBrightnessByTime: Record<TimeOfDay, number> = {
  day: 1,
  sunrise: 1,
  sunset: 0.96,
  night: 0.9,
}
