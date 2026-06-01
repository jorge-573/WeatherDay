export type UnitSystem = 'imperial' | 'metric'

export type UnitConfig = {
  temperatureUnit: 'fahrenheit' | 'celsius'
  windSpeedUnit: 'mph' | 'kmh'
  precipitationUnit: 'inch' | 'mm'
  temperatureLabel: string
  windLabel: string
  visibilityLabel: string
  visibilityDivisor: number
}

export const UNIT_CONFIG: Record<UnitSystem, UnitConfig> = {
  imperial: {
    temperatureUnit: 'fahrenheit',
    windSpeedUnit: 'mph',
    precipitationUnit: 'inch',
    temperatureLabel: '°F',
    windLabel: 'mph',
    visibilityLabel: 'mi',
    visibilityDivisor: 1609.34,
  },
  metric: {
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    precipitationUnit: 'mm',
    temperatureLabel: '°C',
    windLabel: 'km/h',
    visibilityLabel: 'km',
    visibilityDivisor: 1000,
  },
}
