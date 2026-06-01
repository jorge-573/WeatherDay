export type WeatherCondition = {
  label: string
  group: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog'
}

const conditions: Record<number, WeatherCondition> = {
  0: { label: 'Clear', group: 'clear' },
  1: { label: 'Mostly Clear', group: 'clear' },
  2: { label: 'Partly Cloudy', group: 'cloudy' },
  3: { label: 'Overcast', group: 'cloudy' },
  45: { label: 'Fog', group: 'fog' },
  48: { label: 'Freezing Fog', group: 'fog' },
  51: { label: 'Light Drizzle', group: 'rain' },
  53: { label: 'Drizzle', group: 'rain' },
  55: { label: 'Heavy Drizzle', group: 'rain' },
  56: { label: 'Freezing Drizzle', group: 'rain' },
  57: { label: 'Heavy Freezing Drizzle', group: 'rain' },
  61: { label: 'Light Rain', group: 'rain' },
  63: { label: 'Rain', group: 'rain' },
  65: { label: 'Heavy Rain', group: 'rain' },
  66: { label: 'Freezing Rain', group: 'rain' },
  67: { label: 'Heavy Freezing Rain', group: 'rain' },
  71: { label: 'Light Snow', group: 'snow' },
  73: { label: 'Snow', group: 'snow' },
  75: { label: 'Heavy Snow', group: 'snow' },
  77: { label: 'Snow Grains', group: 'snow' },
  80: { label: 'Light Showers', group: 'rain' },
  81: { label: 'Showers', group: 'rain' },
  82: { label: 'Heavy Showers', group: 'rain' },
  85: { label: 'Light Snow Showers', group: 'snow' },
  86: { label: 'Heavy Snow Showers', group: 'snow' },
  95: { label: 'Thunderstorm', group: 'thunder' },
  96: { label: 'Thunderstorm w/ Hail', group: 'thunder' },
  99: { label: 'Severe Thunderstorm', group: 'thunder' },
}

export function getWeatherCondition(code: number): WeatherCondition {
  return conditions[code] ?? { label: 'Unknown', group: 'cloudy' }
}
