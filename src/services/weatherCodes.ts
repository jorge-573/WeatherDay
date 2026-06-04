export type WeatherIntensity = 'light' | 'normal' | 'heavy'

export type WeatherCondition = {
  label: string
  group: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog'
  // Only meaningful for precipitation (rain/snow); drives intensity-aware icons.
  intensity?: WeatherIntensity
}

const conditions: Record<number, WeatherCondition> = {
  0: { label: 'Clear', group: 'clear' },
  1: { label: 'Mostly Clear', group: 'clear' },
  2: { label: 'Partly Cloudy', group: 'cloudy' },
  3: { label: 'Overcast', group: 'cloudy' },
  45: { label: 'Fog', group: 'fog' },
  48: { label: 'Freezing Fog', group: 'fog' },
  51: { label: 'Light Drizzle', group: 'rain', intensity: 'light' },
  53: { label: 'Drizzle', group: 'rain', intensity: 'normal' },
  55: { label: 'Heavy Drizzle', group: 'rain', intensity: 'heavy' },
  56: { label: 'Freezing Drizzle', group: 'rain', intensity: 'light' },
  57: { label: 'Heavy Freezing Drizzle', group: 'rain', intensity: 'heavy' },
  61: { label: 'Light Rain', group: 'rain', intensity: 'light' },
  63: { label: 'Rain', group: 'rain', intensity: 'normal' },
  65: { label: 'Heavy Rain', group: 'rain', intensity: 'heavy' },
  66: { label: 'Freezing Rain', group: 'rain', intensity: 'normal' },
  67: { label: 'Heavy Freezing Rain', group: 'rain', intensity: 'heavy' },
  71: { label: 'Light Snow', group: 'snow', intensity: 'light' },
  73: { label: 'Snow', group: 'snow', intensity: 'normal' },
  75: { label: 'Heavy Snow', group: 'snow', intensity: 'heavy' },
  77: { label: 'Snow Grains', group: 'snow', intensity: 'light' },
  80: { label: 'Light Showers', group: 'rain', intensity: 'light' },
  81: { label: 'Showers', group: 'rain', intensity: 'normal' },
  82: { label: 'Heavy Showers', group: 'rain', intensity: 'heavy' },
  85: { label: 'Light Snow Showers', group: 'snow', intensity: 'light' },
  86: { label: 'Heavy Snow Showers', group: 'snow', intensity: 'heavy' },
  95: { label: 'Thunderstorm', group: 'thunder' },
  96: { label: 'Thunderstorm w/ Hail', group: 'thunder' },
  99: { label: 'Severe Thunderstorm', group: 'thunder' },
}

export function getWeatherCondition(code: number): WeatherCondition {
  return conditions[code] ?? { label: 'Unknown', group: 'cloudy' }
}
