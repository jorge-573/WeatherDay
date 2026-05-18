import { Footer } from '../../components/Footer'
import { CurrentWeather } from '../../components/CurrentWeather'
import { DailyForecast } from '../../components/DailyForecast'
import { DailyNarrative } from '../../components/DailyNarrative'
import { Header } from '../../components/Header'
import { HourlyForecast } from '../../components/HourlyForecast'
import { WeatherStats } from '../../components/WeatherStats'
import type { WeatherData } from '../../hooks/useWeather'
import type { GeocodingResult } from '../../types/weather'
import { CenterColumn, Main, Page, RightColumn, StatusMessage } from './Home.styles'

type HomeProps = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  onCitySelect: (city: GeocodingResult) => void
}

export function Home({ data, loading, error, onCitySelect }: HomeProps) {
  return (
    <Page>
      <Header onCitySelect={onCitySelect} />

      <Main>
        {data ? (
          <>
            <CenterColumn>
              <CurrentWeather data={data.current} />
              <HourlyForecast data={data.hourly} />
              <WeatherStats data={data.stats} />
            </CenterColumn>

            <RightColumn>
              <DailyForecast data={data.daily} />
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
