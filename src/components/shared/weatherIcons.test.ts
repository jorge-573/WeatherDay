import { describe, expect, it } from 'vitest'
import { WEATHER_ICON_PATHS } from './weatherIconPaths'
import { getWeatherIcon } from './weatherIcons'

describe('getWeatherIcon', () => {
  it('resolves every WMO code to an icon with path data, day and night', () => {
    for (let code = 0; code <= 99; code++) {
      for (const isNight of [false, true]) {
        expect(WEATHER_ICON_PATHS[getWeatherIcon(code, isNight)]).toMatch(/^M/)
      }
    }
  })

  it('uses night variants only where they exist', () => {
    expect(getWeatherIcon(0)).toBe('sunny')
    expect(getWeatherIcon(0, true)).toBe('bedtime')
    expect(getWeatherIcon(2, true)).toBe('partlyCloudyNight')
    expect(getWeatherIcon(63, true)).toBe('rainy')
  })

  it('splits precipitation by intensity', () => {
    expect([61, 63, 65].map((code) => getWeatherIcon(code))).toEqual(['rainyLight', 'rainy', 'rainyHeavy'])
    expect([71, 73, 75].map((code) => getWeatherIcon(code))).toEqual(['snowing', 'weatherSnowy', 'snowingHeavy'])
  })
})
