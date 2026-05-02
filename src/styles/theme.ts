import type { TimeOfDay } from '../types/timeOfDay'

export type CardTheme = {
  panelBackground: string
  panelBorder: string
  panelShadow: string
  textPrimary: string
  textMuted: string
  accent: string
}

const backgroundsByTime: Record<TimeOfDay, string> = {
  night:
    'radial-gradient(circle at 80% 16%, rgba(36, 64, 92, 0.55), rgba(6, 16, 33, 0) 32%), linear-gradient(135deg, #041422 0%, #00344d 60%, #000c17 100%)',
  day: 'linear-gradient(135deg, #dff8ff 0%, #96e2ff 45%, #6dd3ff 100%)',
  sunrise:
    'radial-gradient(circle at 12% 16%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 32%), linear-gradient(135deg, #ffd06f 0%, #f2a04f 30%, #6f327d 68%, #2a1d39 100%)',
  sunset:
    'radial-gradient(circle at 88% 84%, rgba(255, 214, 120, 0.32), rgba(255, 214, 120, 0) 30%), linear-gradient(135deg, #2a1d39 0%, #6f327d 52%, #f2a04f 82%, #ffd06f 100%)',
}

const overlayByTime: Record<TimeOfDay, string> = {
  night: 'rgba(0, 0, 0, 0.25)',
  day: 'rgba(255, 255, 255, 0.1)',
  sunrise: 'rgba(0, 0, 0, 0.12)',
  sunset: 'rgba(0, 0, 0, 0.12)',
}

const cardThemeByTime: Record<TimeOfDay, CardTheme> = {
  day: {
    panelBackground: 'rgba(255, 255, 255, 0.38)',
    panelBorder: 'rgba(255, 255, 255, 0.6)',
    panelShadow: '0 22px 42px rgba(17, 67, 97, 0.18)',
    textPrimary: '#083455',
    textMuted: 'rgba(8, 52, 85, 0.78)',
    accent: '#067fb0',
  },
  sunrise: {
    panelBackground: 'rgba(47, 19, 58, 0.36)',
    panelBorder: 'rgba(248, 184, 124, 0.42)',
    panelShadow: '0 24px 44px rgba(31, 9, 36, 0.44)',
    textPrimary: '#fff4e2',
    textMuted: 'rgba(255, 240, 219, 0.78)',
    accent: '#f8c56e',
  },
  sunset: {
    panelBackground: 'rgba(43, 15, 53, 0.4)',
    panelBorder: 'rgba(247, 182, 110, 0.42)',
    panelShadow: '0 24px 44px rgba(22, 6, 31, 0.48)',
    textPrimary: '#fff3de',
    textMuted: 'rgba(255, 236, 204, 0.78)',
    accent: '#f4bf63',
  },
  night: {
    panelBackground: 'rgba(5, 23, 44, 0.48)',
    panelBorder: 'rgba(114, 162, 203, 0.33)',
    panelShadow: '0 24px 44px rgba(2, 8, 20, 0.56)',
    textPrimary: '#eaf4ff',
    textMuted: 'rgba(214, 232, 248, 0.74)',
    accent: '#5dcfff',
  },
}

export const appTheme = {
  backgroundsByTime,
  overlayByTime,
  cardThemeByTime,
}

export const getCardTheme = (timeOfDay: TimeOfDay) => appTheme.cardThemeByTime[timeOfDay]

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends CardTheme {}
}
