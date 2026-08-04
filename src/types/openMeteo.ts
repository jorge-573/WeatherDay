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
    dew_point_2m?: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m?: number
    pressure_msl?: number
    uv_index?: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    precipitation_probability?: number[]
    // Pressure is always hPa; visibility follows `precipitation_unit` (feet for
    // inches, metres for mm). `domain/mappers` converts both for display.
    pressure_msl?: (number | null)[]
    visibility?: (number | null)[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_probability_max?: number[]
    precipitation_sum?: (number | null)[]
    precipitation_hours?: (number | null)[]
    /** Seconds. */
    daylight_duration?: number[]
    /** Seconds. */
    sunshine_duration?: number[]
  }
}

/** Raw payload from Open-Meteo's separate air-quality host. */
export type AirQualityResponse = {
  current?: {
    time: string
    us_aqi?: number | null
    pm2_5?: number | null
  }
}
