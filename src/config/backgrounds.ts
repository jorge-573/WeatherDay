import type { TimeOfDay } from '../types/timeOfDay'

export const BACKGROUNDS_BY_TIME: Record<TimeOfDay, string> = {
  night:
    'radial-gradient(circle at 80% 16%, rgba(36, 64, 92, 0.55), rgba(6, 16, 33, 0) 32%), linear-gradient(135deg, #041422 0%, #00344d 60%, #000c17 100%)',
  day: 'linear-gradient(135deg, #dff8ff 0%, #96e2ff 45%, #6dd3ff 100%)',
  sunrise:
    'radial-gradient(circle at 12% 16%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 32%), linear-gradient(135deg, #ffd06f 0%, #f2a04f 30%, #6f327d 68%, #2a1d39 100%)',
  sunset:
    'radial-gradient(circle at 88% 84%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 30%), linear-gradient(135deg, #2a1d39 0%, #6f327d 52%, #f2a04f 82%, #ffd06f 100%)',
}

export const OVERLAY_BY_TIME: Record<TimeOfDay, string> = {
  night: 'rgba(0, 0, 0, 0.25)',
  day: 'rgba(255, 255, 255, 0.1)',
  sunrise: 'rgba(0, 0, 0, 0.12)',
  sunset: 'rgba(0, 0, 0, 0.12)',
}
