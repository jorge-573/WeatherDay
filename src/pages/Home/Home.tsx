import { Footer } from '../../Components/Footer'
import { CurrentWeather } from '../../Components/CurrentWeather'
import { DailyForecast } from '../../Components/DailyForecast'
import { DailyNarrative } from '../../Components/DailyNarrative'
import { Header } from '../../Components/Header'
import { HourlyForecast } from '../../Components/HourlyForecast'
import { WeatherStats } from '../../Components/WeatherStats'
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
