import { ROUTES } from './routes'

export type NavLinkItem = {
  label: string
  to?: string
}

export const navLinks: NavLinkItem[] = [
  { label: 'Dashboard', to: ROUTES.home },
  { label: 'Radar', to: ROUTES.radar },
  { label: 'Forecasts' },
  { label: 'Historical' },
]
