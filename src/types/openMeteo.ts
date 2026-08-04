/**
 * Raw Open-Meteo forecast payload, in the provider's snake_case shape. Lives here
 * rather than in the service because `domain/mappers` consumes it directly.
 */
export type ForecastResponse = {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    uv_index?: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    precipitation_probability?: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_probability_max?: number[]
  }
}
