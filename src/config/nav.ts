import { ROUTES } from './routes'

export type NavLinkItem =
  | { label: string; to: string; disabled?: false }
  | { label: string; disabled: true; to?: never }

export const navLinks: NavLinkItem[] = [
  { label: 'Dashboard', to: ROUTES.home },
  { label: 'Radar', to: ROUTES.radar },
  { label: 'Outlooks', to: ROUTES.outlooks },
  { label: 'Historical', disabled: true },
]
