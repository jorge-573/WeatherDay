import { Footer } from '../../components/Footer'
import { CurrentWeather } from '../../components/CurrentWeather'
import { DailyForecast } from '../../components/DailyForecast'
import { DailyNarrative } from '../../components/DailyNarrative'
import { Header } from '../../components/Header'
import { HourlyForecast } from '../../components/HourlyForecast'
import { WeatherStats } from '../../components/WeatherStats'
import { UNIT_CONFIG, type UnitSystem } from '../../config/units'
import type { WeatherData } from '../../hooks/useWeather'
import type { GeocodingResult } from '../../types/weather'
import { CenterColumn, Main, Page, RightColumn, StatusMessage } from './Home.styles'

type HomeProps = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  units: UnitSystem
  onCitySelect: (city: GeocodingResult) => void
  onUnitChange: (units: UnitSystem) => void
}

export function Home({ data, loading, error, units, onCitySelect, onUnitChange }: HomeProps) {
  const temperatureLabel = UNIT_CONFIG[units].temperatureLabel

  return (
    <Page>
      <Header units={units} onCitySelect={onCitySelect} onUnitChange={onUnitChange} />

      <Main>
        {data ? (
          <>
            <CenterColumn>
              <CurrentWeather data={data.current} temperatureLabel={temperatureLabel} />
              <HourlyForecast data={data.hourly} temperatureLabel={temperatureLabel} />
              <WeatherStats data={data.stats} />
            </CenterColumn>

            <RightColumn>
              <DailyForecast data={data.daily} temperatureLabel={temperatureLabel} />
              <DailyNarrative data={data.narrative} />
            </RightColumn>
          </>
        ) : loading ? (
          <StatusMessage>Loading weather…</StatusMessage>
        ) : error ? (
          <StatusMessage>Could not load weather: {error}</StatusMessage>
        ) : (
          <StatusMessage>Search for a city to see the forecast.</StatusMessage>
        )}
      </Main>

      <Footer />
    </Page>
  )
}
