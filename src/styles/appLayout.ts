import styled from 'styled-components'
import { OVERLAY_BY_TIME } from '../config/backgrounds'
import type { TimeOfDay } from '../types/timeOfDay'

type CardTheme = {
  panelBackground: string
  panelBorder: string
  panelShadow: string
  textPrimary: string
  textMuted: string
  accent: string
}

const CARD_THEME_BY_TIME: Record<TimeOfDay, CardTheme> = {
  day: {
    panelBackground: 'rgba(255, 255, 255, 0.38)',
    panelBorder: 'rgba(255, 255, 255, 0.6)',
    panelShadow: '0 22px 42px rgba(17, 67, 97, 0.18)',
    textPrimary: '#083455',
    textMuted: 'rgba(8, 52, 85, 0.78)',
    accent: '#067fb0',
  },
  sunrise: {
    panelBackground: 'rgba(47, 19, 58, 0.36)',
    panelBorder: 'rgba(248, 184, 124, 0.42)',
    panelShadow: '0 24px 44px rgba(31, 9, 36, 0.44)',
    textPrimary: '#fff4e2',
    textMuted: 'rgba(255, 240, 219, 0.78)',
    accent: '#f8c56e',
  },
  sunset: {
    panelBackground: 'rgba(43, 15, 53, 0.4)',
    panelBorder: 'rgba(247, 182, 110, 0.42)',
    panelShadow: '0 24px 44px rgba(22, 6, 31, 0.48)',
    textPrimary: '#fff3de',
    textMuted: 'rgba(255, 236, 204, 0.78)',
    accent: '#f4bf63',
  },
  night: {
    panelBackground: 'rgba(5, 23, 44, 0.48)',
    panelBorder: 'rgba(114, 162, 203, 0.33)',
    panelShadow: '0 24px 44px rgba(2, 8, 20, 0.56)',
    textPrimary: '#eaf4ff',
    textMuted: 'rgba(214, 232, 248, 0.74)',
    accent: '#5dcfff',
  },
}

const getCardTheme = (timeOfDay: TimeOfDay) => CARD_THEME_BY_TIME[timeOfDay]

type TimeProps = { $timeOfDay: TimeOfDay }

export const AppShell = styled.div<{ $background: string }>`
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  background: ${({ $background }) => $background};
  transition: background 0.7s ease-in-out;
  overflow: auto;
`

export const Overlay = styled.div<TimeProps>`
  width: 100%;
  min-height: 100vh;
  padding: 1.2rem;
  box-sizing: border-box;
  background: ${({ $timeOfDay }) => OVERLAY_BY_TIME[$timeOfDay]};

  @media (max-width: 768px) {
    padding: 0.85rem;
  }
`

export const PageFrame = styled.div`
  width: min(1400px, 100%);
  min-height: calc(100vh - 2.4rem);
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;

  @media (max-width: 768px) {
    min-height: calc(100vh - 1.7rem);
  }
`

export const GlassPanel = styled.section<TimeProps>`
  border-radius: 28px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  background: ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBackground};
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
  box-shadow: ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelShadow};
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
`

export const Header = styled(GlassPanel).attrs({ as: 'header' })<TimeProps>`
  padding: 0.95rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

export const HeaderBrand = styled.div`
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  font-weight: 700;
  letter-spacing: 0.015em;
`

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.1rem;

  @media (max-width: 760px) {
    gap: 0.6rem;
    flex-wrap: wrap;
  }
`

export const HeaderLink = styled.a<TimeProps>`
  font-size: 0.9rem;
  text-decoration: none;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: 0.2s ease-in-out;

  &:hover,
  &:focus-visible {
    color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
    border-bottom-color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).accent};
    outline: none;
  }
`

export const HeaderActions = styled.div<TimeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  font-size: 0.84rem;
`

export const Main = styled.main`
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 320px;
  gap: 1rem;
  min-height: 0;

  @media (max-width: 1220px) {
    grid-template-columns: 175px minmax(0, 1fr);
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

export const SidebarCard = styled(GlassPanel).attrs({ as: 'aside' })<TimeProps>`
  padding: 1.1rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`

export const SidebarMenu = styled.nav`
  display: grid;
  gap: 0.5rem;
`

export const SidebarItem = styled.button<TimeProps & { $active?: boolean }>`
  border: 1px solid ${({ $active, $timeOfDay }) => ($active ? getCardTheme($timeOfDay).panelBorder : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.12)' : 'transparent')};
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
  padding: 0.6rem 0.7rem;
  border-radius: 14px;
  text-align: left;
  cursor: pointer;
  font: inherit;
`

export const CenterColumn = styled.section`
  display: grid;
  gap: 1rem;
  min-width: 0;
`

export const CurrentWeatherCard = styled(GlassPanel)<TimeProps>`
  padding: 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(200px, 1fr);
  min-height: 230px;
  overflow: hidden;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const WeatherSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  padding-right: 0.8rem;
`

export const WeatherVisual = styled.div<TimeProps>`
  border-radius: 18px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.05));
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textPrimary};
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  line-height: 1.1;
`

export const City = styled.p`
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
`

export const Temperature = styled.p`
  margin: 0;
  font-size: clamp(2.9rem, 7vw, 5.1rem);
  line-height: 0.95;
  font-weight: 700;
`

export const Condition = styled.p`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`

export const MetaTag = styled.span<TimeProps>`
  border-radius: 999px;
  border: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  padding: 0.3rem 0.8rem;
  font-size: 0.84rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
  background: rgba(255, 255, 255, 0.18);
`

export const HourlyCard = styled(GlassPanel)<TimeProps>`
  padding: 1.2rem;
`

export const HourlyRow = styled.div`
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: repeat(6, minmax(70px, 1fr));
  gap: 0.6rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(3, minmax(70px, 1fr));
  }

  @media (max-width: 510px) {
    grid-template-columns: repeat(2, minmax(70px, 1fr));
  }
`

export const HourlyItem = styled.div<TimeProps & { $active?: boolean }>`
  border-radius: 14px;
  border: 1px solid ${({ $timeOfDay, $active }) => ($active ? getCardTheme($timeOfDay).panelBorder : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.16)' : 'transparent')};
  padding: 0.65rem 0.45rem;
  text-align: center;
  min-height: 94px;
`

export const HourLabel = styled.p`
  margin: 0;
  font-size: 0.84rem;
  opacity: 0.84;
`

export const HourTemp = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 600;
`

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const StatCard = styled(GlassPanel)<TimeProps>`
  padding: 0.9rem;
`

export const StatLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.78;
`

export const StatValue = styled.p`
  margin: 0.35rem 0 0;
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
`

export const StatSubtext = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.93rem;
  opacity: 0.86;
`

export const RightColumn = styled.aside`
  display: grid;
  gap: 1rem;
  align-content: start;

  @media (max-width: 1220px) {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const ForecastCard = styled(GlassPanel)<TimeProps>`
  padding: 1.1rem;
`

export const ForecastRow = styled.div<TimeProps>`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const ForecastDay = styled.p`
  margin: 0;
  font-size: 0.95rem;
`

export const ForecastTemp = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

export const ForecastRange = styled.div<TimeProps>`
  width: 86px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${({ $timeOfDay }) => getCardTheme($timeOfDay).accent},
    rgba(201, 84, 255, 0.8)
  );
`

export const NarrativeCard = styled(GlassPanel)<TimeProps>`
  padding: 1.1rem;
`

export const Paragraph = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  line-height: 1.45;
  opacity: 0.9;
`

export const Divider = styled.hr<TimeProps>`
  border: 0;
  border-top: 1px solid ${({ $timeOfDay }) => getCardTheme($timeOfDay).panelBorder};
  margin: 0.9rem 0;
`

export const Footer = styled(GlassPanel).attrs({ as: 'footer' })<TimeProps>`
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
`

export const FooterLinks = styled.nav`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`

export const FooterLink = styled.a<TimeProps>`
  text-decoration: none;
  font-size: 0.9rem;
  color: ${({ $timeOfDay }) => getCardTheme($timeOfDay).textMuted};
`

export const FooterNote = styled.p`
  margin: 0;
  font-size: 0.84rem;
  opacity: 0.8;
`
