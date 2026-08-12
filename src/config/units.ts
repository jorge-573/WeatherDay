export type UnitSystem = 'imperial' | 'metric'

export type UnitConfig = {
  temperatureUnit: 'fahrenheit' | 'celsius'
  windSpeedUnit: 'mph' | 'kmh'
  precipitationUnit: 'inch' | 'mm'
  temperatureLabel: string
  windLabel: string
  precipitationLabel: string
  pressureLabel: string
  visibilityLabel: string
}

export const UNIT_CONFIG: Record<UnitSystem, UnitConfig> = {
  imperial: {
    temperatureUnit: 'fahrenheit',
    windSpeedUnit: 'mph',
    precipitationUnit: 'inch',
    temperatureLabel: '°F',
    windLabel: 'mph',
    precipitationLabel: 'in',
    pressureLabel: 'inHg',
    visibilityLabel: 'mi',
  },
  metric: {
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    precipitationUnit: 'mm',
    temperatureLabel: '°C',
    windLabel: 'km/h',
    precipitationLabel: 'mm',
    pressureLabel: 'hPa',
    visibilityLabel: 'km',
  },
}
