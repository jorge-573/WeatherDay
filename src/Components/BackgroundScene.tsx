import { useMemo } from 'react'
import { BACKGROUNDS_BY_TIME } from '../config/backgrounds'
import {
  AppShell,
  CenterColumn,
  City,
  Condition,
  CurrentWeatherCard,
  Divider,
  Footer,
  FooterLink,
  FooterLinks,
  FooterNote,
  ForecastCard,
  ForecastDay,
  ForecastRange,
  ForecastRow,
  ForecastTemp,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderLink,
  HeaderNav,
  HourLabel,
  HourTemp,
  HourlyCard,
  HourlyItem,
  HourlyRow,
  Main,
  MetaRow,
  MetaTag,
  Overlay,
  PageFrame,
  Paragraph,
  RightColumn,
  SectionTitle,
  SidebarCard,
  SidebarItem,
  SidebarMenu,
  StatCard,
  StatGrid,
  StatLabel,
  StatSubtext,
  StatValue,
  Temperature,
  WeatherSummary,
  WeatherVisual,
  NarrativeCard,
} from '../styles/appLayout'
import type { TimeOfDay } from '../types/timeOfDay'
import { formatTimeOfDayLabel } from '../utils/getTimeOfDay'

type BackgroundSceneProps = {
  timeOfDay: TimeOfDay
  weatherBackgroundOverride?: string | null
}

export function BackgroundScene({
  timeOfDay,
  weatherBackgroundOverride = null,
}: BackgroundSceneProps) {
  const activeBackground = useMemo(() => {
    return weatherBackgroundOverride ?? BACKGROUNDS_BY_TIME[timeOfDay]
  }, [timeOfDay, weatherBackgroundOverride])

  const displayTimeOfDay = formatTimeOfDayLabel(timeOfDay)
  const dailyForecast = [
    { day: 'Today', low: 58, high: 76 },
    { day: 'Tue', low: 56, high: 72 },
    { day: 'Wed', low: 54, high: 65 },
    { day: 'Thu', low: 52, high: 61 },
    { day: 'Fri', low: 58, high: 78 },
    { day: 'Sat', low: 60, high: 82 },
    { day: 'Sun', low: 59, high: 79 },
  ]
  const hourlyForecast = [
    { hour: 'Now', temp: 72, active: true },
    { hour: '2 PM', temp: 74, active: false },
    { hour: '3 PM', temp: 76, active: false },
    { hour: '4 PM', temp: 75, active: false },
    { hour: '5 PM', temp: 73, active: false },
    { hour: '6 PM', temp: 69, active: false },
  ]
  const stats = [
    { label: 'UV Index', value: '2', note: 'Low' },
    { label: 'Wind', value: '12 mph', note: 'NW direction' },
    { label: 'Humidity', value: '48%', note: 'Dew point 52 deg' },
    { label: 'Visibility', value: '10 mi', note: 'Clear view' },
  ]

  return (
    <AppShell $background={activeBackground}>
      <Overlay $timeOfDay={timeOfDay}>
        <PageFrame>
          <Header $timeOfDay={timeOfDay}>
            <HeaderBrand>Atmospheric Precision</HeaderBrand>
            <HeaderNav>
              <HeaderLink href="#" $timeOfDay={timeOfDay}>
                Forecast
              </HeaderLink>
              <HeaderLink href="#" $timeOfDay={timeOfDay}>
                Maps
              </HeaderLink>
              <HeaderLink href="#" $timeOfDay={timeOfDay}>
                Air Quality
              </HeaderLink>
              <HeaderLink href="#" $timeOfDay={timeOfDay}>
                History
              </HeaderLink>
            </HeaderNav>
            <HeaderActions $timeOfDay={timeOfDay}>San Francisco, CA | {displayTimeOfDay}</HeaderActions>
          </Header>

          <Main>
            <SidebarCard $timeOfDay={timeOfDay}>
              <div>
                <SectionTitle>Sky Observer</SectionTitle>
                <Paragraph>Local weather</Paragraph>
              </div>
              <SidebarMenu>
                <SidebarItem $timeOfDay={timeOfDay} $active>
                  Current
                </SidebarItem>
                <SidebarItem $timeOfDay={timeOfDay}>Hourly</SidebarItem>
                <SidebarItem $timeOfDay={timeOfDay}>7-Day</SidebarItem>
                <SidebarItem $timeOfDay={timeOfDay}>Details</SidebarItem>
              </SidebarMenu>
            </SidebarCard>

            <CenterColumn>
              <CurrentWeatherCard $timeOfDay={timeOfDay}>
                <WeatherSummary>
                  <div>
                    <City>San Francisco, CA</City>
                    <Temperature>72 deg</Temperature>
                    <Condition>Mostly Sunny</Condition>
                  </div>
                  <MetaRow>
                    <MetaTag $timeOfDay={timeOfDay}>H: 76 | L: 58</MetaTag>
                    <MetaTag $timeOfDay={timeOfDay}>Feels like 74</MetaTag>
                  </MetaRow>
                </WeatherSummary>
                <WeatherVisual $timeOfDay={timeOfDay}>
                  <SectionTitle>Golden Hour</SectionTitle>
                  <Paragraph>Sunset in 42 mins</Paragraph>
                </WeatherVisual>
              </CurrentWeatherCard>

              <HourlyCard $timeOfDay={timeOfDay}>
                <SectionTitle>24-Hour Forecast</SectionTitle>
                <HourlyRow>
                  {hourlyForecast.map((entry) => (
                    <HourlyItem key={entry.hour} $timeOfDay={timeOfDay} $active={entry.active}>
                      <HourLabel>{entry.hour}</HourLabel>
                      <HourTemp>{entry.temp} deg</HourTemp>
                    </HourlyItem>
                  ))}
                </HourlyRow>
              </HourlyCard>

              <StatGrid>
                {stats.map((entry) => (
                  <StatCard key={entry.label} $timeOfDay={timeOfDay}>
                    <StatLabel>{entry.label}</StatLabel>
                    <StatValue>{entry.value}</StatValue>
                    <StatSubtext>{entry.note}</StatSubtext>
                  </StatCard>
                ))}
              </StatGrid>
            </CenterColumn>

            <RightColumn>
              <ForecastCard $timeOfDay={timeOfDay}>
                <SectionTitle>7-Day Forecast</SectionTitle>
                {dailyForecast.map((entry) => (
                  <ForecastRow key={entry.day} $timeOfDay={timeOfDay}>
                    <ForecastDay>{entry.day}</ForecastDay>
                    <ForecastRange $timeOfDay={timeOfDay} />
                    <ForecastTemp>
                      {entry.low} / {entry.high}
                    </ForecastTemp>
                  </ForecastRow>
                ))}
              </ForecastCard>

              <NarrativeCard $timeOfDay={timeOfDay}>
                <SectionTitle>Daily Narrative</SectionTitle>
                <Paragraph>
                  Today: Increasing clouds through the afternoon with a peak temperature near 76 and light
                  winds from the northwest.
                </Paragraph>
                <Divider $timeOfDay={timeOfDay} />
                <Paragraph>
                  Tonight: Skies clear after midnight and temperatures cool to around 58 with calm winds.
                </Paragraph>
                <Divider $timeOfDay={timeOfDay} />
                <Paragraph>Tomorrow: Full sun through the day and a high near 72 with dry conditions.</Paragraph>
              </NarrativeCard>
            </RightColumn>
          </Main>

          <Footer $timeOfDay={timeOfDay}>
            <FooterLinks>
              <FooterLink href="#" $timeOfDay={timeOfDay}>
                Privacy Policy
              </FooterLink>
              <FooterLink href="#" $timeOfDay={timeOfDay}>
                Terms of Service
              </FooterLink>
              <FooterLink href="#" $timeOfDay={timeOfDay}>
                Contact
              </FooterLink>
              <FooterLink href="#" $timeOfDay={timeOfDay}>
                API Access
              </FooterLink>
            </FooterLinks>
            <FooterNote>Atmospheric Precision | Demo weather skeleton</FooterNote>
          </Footer>
        </PageFrame>
      </Overlay>
    </AppShell>
  )
}
