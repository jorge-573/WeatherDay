import type { TimeOfDay } from '../types/timeOfDay'

// Ambient page backdrop. The component palette stays a fixed dark MD3 scheme;
// only this gradient + overlay shift with the looked-up location's time of day.
export const backgroundsByTime: Record<TimeOfDay, string> = {
  night:
    'radial-gradient(circle at 80% 16%, rgba(36, 64, 92, 0.55), rgba(6, 16, 33, 0) 32%), linear-gradient(135deg, #041422 0%, #00344d 60%, #000c17 100%)',
  day: 'radial-gradient(circle at 50% -8%, rgba(114, 220, 255, 0.38), transparent 42%), radial-gradient(circle at 78% 14%, rgba(140, 120, 200, 0.28), transparent 38%), linear-gradient(165deg, #3d7a9e 0%, #2a5f7f 42%, #1a3d52 100%)',
  sunrise:
    'radial-gradient(ellipse 95% 75% at 8% 6%, rgba(255, 200, 110, 0.55), transparent 52%), radial-gradient(circle at 28% 22%, rgba(255, 140, 90, 0.38), transparent 42%), radial-gradient(circle at 55% 35%, rgba(244, 166, 184, 0.22), transparent 48%), linear-gradient(175deg, #6b4a72 0%, #9a5a5a 18%, #c47a52 34%, #5a6a94 52%, #243550 72%, #121c28 100%)',
  sunset:
    'radial-gradient(ellipse 100% 72% at 92% 92%, rgba(255, 165, 85, 0.58), transparent 52%), radial-gradient(circle at 72% 78%, rgba(235, 95, 75, 0.45), transparent 44%), radial-gradient(circle at 48% 62%, rgba(180, 85, 130, 0.3), transparent 50%), linear-gradient(195deg, #2a1f3d 0%, #5a2e4a 14%, #8c4238 28%, #b85a3c 40%, #6a4a6e 56%, #2e3a58 74%, #0f1720 100%)',
}

export const overlayByTime: Record<TimeOfDay, string> = {
  night: 'rgba(0, 0, 0, 0.28)',
  day: 'rgba(0, 0, 0, 0.05)',
  sunrise: 'rgba(0, 0, 0, 0.1)',
  sunset: 'rgba(0, 0, 0, 0.1)',
}

// Subtle extra dimming on top of the art (night scenes are already dark).
export const sceneBrightnessByTime: Record<TimeOfDay, number> = {
  day: 1,
  sunrise: 1,
  sunset: 0.96,
  night: 0.9,
}
