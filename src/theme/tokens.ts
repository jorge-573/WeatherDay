// Material Design 3 color tokens (dark scheme) sourced from the redesign mocks.
// These are the single source of truth for color; the MUI theme maps the common
// roles onto `palette`, and the full set is exposed via `md3` for surface tints
// and other roles MUI's palette does not model directly.
export const md3 = {
  primary: '#72dcff',
  onPrimary: '#004c5e',
  primaryContainer: '#00d2ff',
  onPrimaryContainer: '#004253',
  primaryFixed: '#00d2ff',
  primaryFixedDim: '#00c3ed',
  primaryDim: '#00c3ed',
  inversePrimary: '#00687f',

  secondary: '#dd8bfb',
  onSecondary: '#4c0068',
  secondaryContainer: '#6e208c',
  onSecondaryContainer: '#f1bfff',
  secondaryDim: '#ce7eec',

  tertiary: '#fffbd2',
  onTertiary: '#646200',
  tertiaryContainer: '#f6f15d',
  onTertiaryContainer: '#5c5900',
  tertiaryFixed: '#fef964',
  tertiaryFixedDim: '#f0eb58',
  tertiaryDim: '#f0eb58',

  error: '#ff716c',
  onError: '#490006',
  errorContainer: '#9f0519',
  onErrorContainer: '#ffa8a3',
  errorDim: '#d7383b',

  background: '#0a0f13',
  onBackground: '#f3f7fd',

  surface: '#0a0f13',
  onSurface: '#f3f7fd',
  onSurfaceVariant: '#a7abb1',
  surfaceVariant: '#1f272c',
  surfaceDim: '#0a0f13',
  surfaceBright: '#252d33',
  surfaceTint: '#72dcff',
  inverseSurface: '#f6faff',
  inverseOnSurface: '#51565a',

  surfaceContainerLowest: '#000000',
  surfaceContainerLow: '#0e1418',
  surfaceContainer: '#141a1f',
  surfaceContainerHigh: '#1a2026',
  surfaceContainerHighest: '#1f272c',

  outline: '#71767b',
  outlineVariant: '#43484d',
} as const

export const fontFamily = {
  display: '"Plus Jakarta Sans", sans-serif',
  body: '"Manrope", sans-serif',
} as const

export const radii = {
  sm: '1rem',
  lg: '2rem',
  xl: '3rem',
  full: '9999px',
} as const
