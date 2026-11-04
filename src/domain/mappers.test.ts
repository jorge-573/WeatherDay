import { describe, expect, it } from 'vitest'
import { toAirQuality, toCurrentWeather, toDailyForecast, toHourlyForecast, toWeatherStats } from './mappers'
import type { ForecastResponse } from '../types/openMeteo'
import type { GeocodingResult } from '../types/weather'

const CITY: GeocodingResult = {
  id: 1,
  name: 'Austin',
  admin1: 'Texas',
  country: 'United States',
  countryCode: 'US',
  latitude: 30.27,
  longitude: -97.74,
}

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const day = i < 24 ? '2026-06-01' : '2026-06-02'
  return `${day}T${String(i % 24).padStart(2, '0')}:00`
})

function makeResponse(overrides: Partial<ForecastResponse['current']> = {}): ForecastResponse {
  return {
    latitude: CITY.latitude,
    longitude: CITY.longitude,
    timezone: 'America/Chicago',
    current: {
      time: '2026-06-01T14:30',
      temperature_2m: 71.6,
      apparent_temperature: 74.4,
      weather_code: 2,
      relative_humidity_2m: 55.4,
      dew_point_2m: 54.6,
      wind_speed_10m: 9.6,
      wind_direction_10m: 225,
      wind_gusts_10m: 18.2,
      pressure_msl: 1012,
      uv_index: 6.5,
      ...overrides,
    },
    hourly: {
      time: HOURS,
      temperature_2m: HOURS.map((_, i) => 60 + (i % 24)),
      weather_code: HOURS.map(() => 61),
      precipitation_probability: HOURS.map(() => 40.4),
      pressure_msl: HOURS.map((_, i) => (i === 11 ? 1008 : 1010)),
      visibility: HOURS.map(() => 52_800),
    },
    daily: {
      time: ['2026-06-01', '2026-06-02'],
      temperature_2m_max: [88.4, 90.6],
      temperature_2m_min: [70.2, 71.5],
      weather_code: [2, 95],
      sunrise: ['2026-06-01T06:00', '2026-06-02T06:01'],
      sunset: ['2026-06-01T20:00', '2026-06-02T20:01'],
      precipitation_probability_max: [40.4, 80.6],
      precipitation_sum: [0.123, 0.5],
      precipitation_hours: [2.4, 5],
      daylight_duration: [50_400, 50_400],
      sunshine_duration: [36_000, 30_000],
    },
  }
}

describe('toCurrentWeather', () => {
  it('rounds temperatures and formats the location', () => {
    expect(toCurrentWeather(makeResponse(), CITY)).toEqual({
      location: 'Austin, Texas, US',
      temperature: 72,
      condition: 'Partly Cloudy',
      code: 2,
      isNight: false,
      group: 'cloudy',
      high: 88,
      low: 70,
      feelsLike: 74,
    })
  })

  it('is night after sunset', () => {
    expect(toCurrentWeather(makeResponse({ time: '2026-06-01T21:00' }), CITY).isNight).toBe(true)
  })
})

describe('toHourlyForecast', () => {
  const hourly = toHourlyForecast(makeResponse())

  it('returns 24 hours starting at the current hour, using current conditions for now', () => {
    expect(hourly).toHaveLength(24)
    expect(hourly[0]).toMatchObject({ hour: 'Now', isNow: true, temperature: 72, code: 2 })
  })

  it('labels later hours in 12-hour time', () => {
    expect(hourly[1]).toMatchObject({ hour: '3 PM', isNow: false, temperature: 75, code: 61 })
    expect(hourly[10].hour).toBe('12 AM')
    expect(hourly[22].hour).toBe('12 PM')
  })

  it('flags night hours and rounds precipitation chance', () => {
    expect(hourly[7]).toMatchObject({ hour: '9 PM', isNight: true, precipitationProbability: 40 })
    expect(hourly[1].isNight).toBe(false)
  })
})

describe('toDailyForecast', () => {
  it('labels the first day Today and the rest by weekday', () => {
    expect(toDailyForecast(makeResponse())).toEqual([
      {
        day: 'Today',
        date: '06/01',
        low: 70,
        high: 88,
        code: 2,
        condition: 'Partly Cloudy',
        precipitationProbability: 40,
      },
      {
        day: 'Tue',
        date: '06/02',
        low: 72,
        high: 91,
        code: 95,
        condition: 'Thunderstorm',
        precipitationProbability: 81,
      },
    ])
  })
})

describe('toWeatherStats', () => {
  it('converts to imperial units', () => {
    const stats = toWeatherStats(makeResponse(), 'imperial')
    expect(stats.wind).toEqual({ value: 10, unit: 'mph', direction: 'SW', bearing: 225, gusts: 18 })
    expect(stats.uv).toEqual({ value: 7, level: 'High' })
    expect(stats.humidity).toEqual({ value: 55, dewPoint: 55 })
    expect(stats.precipitation).toEqual({ total: '0.12', unit: 'in', hours: 2 })
    expect(stats.pressure).toEqual({ value: '29.88', unit: 'inHg', trend: 'rising' })
    expect(stats.visibility).toEqual({ value: '10', unit: 'mi' })
  })

  it('converts to metric units', () => {
    const stats = toWeatherStats(makeResponse(), 'metric')
    expect(stats.pressure.value).toBe('1012')
    expect(stats.precipitation.total).toBe('0.1')
    expect(stats.visibility).toEqual({ value: '53', unit: 'km' })
  })

  it('reports steady pressure for small changes', () => {
    expect(toWeatherStats(makeResponse({ pressure_msl: 1008.5 }), 'metric').pressure.trend).toBe('steady')
  })

  it('tracks the sun during daylight', () => {
    const { sun } = toWeatherStats(makeResponse(), 'imperial')
    expect(sun).toMatchObject({
      sunrise: '6:00 AM',
      sunset: '8:00 PM',
      phase: 'daylight',
      until: '5h 30m',
      daylight: '14h 0m',
      sunshine: '10h 0m',
    })
    expect(sun.progress).toBeCloseTo(510 / 840)
  })

  it('counts down to tomorrow sunrise after sunset', () => {
    const { sun } = toWeatherStats(makeResponse({ time: '2026-06-01T22:00' }), 'imperial')
    expect(sun).toMatchObject({ phase: 'afterSunset', until: '8h 1m' })
  })
})

describe('toAirQuality', () => {
  it('returns null without an AQI reading', () => {
    expect(toAirQuality(null)).toBeNull()
    expect(toAirQuality({ current: { time: '2026-06-01T14:00', us_aqi: null } })).toBeNull()
  })

  it('categorizes the rounded AQI and rounds PM2.5 to one decimal', () => {
    expect(toAirQuality({ current: { time: '2026-06-01T14:00', us_aqi: 50.4, pm2_5: 12.345 } })).toEqual({
      aqi: 50,
      category: 'good',
      label: 'Good',
      pm25: 12.3,
    })
    expect(toAirQuality({ current: { time: '2026-06-01T14:00', us_aqi: 151 } })).toMatchObject({
      category: 'unhealthy',
      pm25: null,
    })
    expect(toAirQuality({ current: { time: '2026-06-01T14:00', us_aqi: 420 } })?.category).toBe('hazardous')
  })
})
