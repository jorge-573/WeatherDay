import { AppFooter } from '../../Components/AppFooter'
import { CurrentWeather } from '../../Components/CurrentWeather'
import { DailyForecast } from '../../Components/DailyForecast'
import { DailyNarrative } from '../../Components/DailyNarrative'
import { Header } from '../../Components/Header'
import { HourlyForecast } from '../../Components/HourlyForecast'
import { Sidebar } from '../../Components/Sidebar'
import { WeatherStats } from '../../Components/WeatherStats'
import type { TimeOfDay } from '../../types/timeOfDay'
import { CenterColumn, Main, Page, RightColumn } from './Home.styles'

type HomeProps = {
  timeOfDay: TimeOfDay
}

export function Home({ timeOfDay }: HomeProps) {
  return (
    <Page>
      <Header timeOfDay={timeOfDay} />

      <Main>
        <Sidebar timeOfDay={timeOfDay} />

        <CenterColumn>
          <CurrentWeather timeOfDay={timeOfDay} />
          <HourlyForecast timeOfDay={timeOfDay} />
          <WeatherStats timeOfDay={timeOfDay} />
        </CenterColumn>

        <RightColumn>
          <DailyForecast timeOfDay={timeOfDay} />
          <DailyNarrative timeOfDay={timeOfDay} />
        </RightColumn>
      </Main>

      <AppFooter timeOfDay={timeOfDay} />
    </Page>
  )
}
