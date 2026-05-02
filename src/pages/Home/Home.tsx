import { Footer } from '../../components/Footer'
import { CurrentWeather } from '../../components/CurrentWeather'
import { DailyForecast } from '../../components/DailyForecast'
import { DailyNarrative } from '../../components/DailyNarrative'
import { Header } from '../../components/Header'
import { HourlyForecast } from '../../components/HourlyForecast'
import { WeatherStats } from '../../components/WeatherStats'
import { CenterColumn, Main, Page, RightColumn } from './Home.styles'

export function Home() {
  return (
    <Page>
      <Header />

      <Main>
        <CenterColumn>
          <CurrentWeather />
          <HourlyForecast />
          <WeatherStats />
        </CenterColumn>

        <RightColumn>
          <DailyForecast />
          <DailyNarrative />
        </RightColumn>
      </Main>

      <Footer />
    </Page>
  )
}
