import { createTheme } from '@mui/material/styles'
import { fontFamily, md3, radii } from './tokens'

// Expose the full MD3 surface/role set on the theme so components can read
// `theme.md3.surfaceContainerHigh` etc. without importing tokens directly.
declare module '@mui/material/styles' {
  interface Theme {
    md3: typeof md3
  }
  interface ThemeOptions {
    md3?: typeof md3
  }
}

export const theme = createTheme({
  md3,
  palette: {
    mode: 'dark',
    primary: { main: md3.primary, contrastText: md3.onPrimary },
    secondary: { main: md3.secondary, contrastText: md3.onSecondary },
    error: { main: md3.error, contrastText: md3.onError },
    background: { default: md3.background, paper: md3.surfaceContainer },
    text: { primary: md3.onSurface, secondary: md3.onSurfaceVariant },
    divider: md3.outlineVariant,
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: fontFamily.body,
    h1: { fontFamily: fontFamily.display, fontWeight: 700 },
    h2: { fontFamily: fontFamily.display, fontWeight: 700 },
    h3: { fontFamily: fontFamily.display, fontWeight: 700 },
    h4: { fontFamily: fontFamily.display, fontWeight: 600 },
    h5: { fontFamily: fontFamily.display, fontWeight: 600 },
    h6: { fontFamily: fontFamily.display, fontWeight: 600 },
    button: { fontFamily: fontFamily.body, textTransform: 'none', fontWeight: 600 },
    overline: { fontFamily: fontFamily.body, fontWeight: 700, letterSpacing: '0.12em' },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: md3.surfaceContainer,
          borderRadius: radii.lg,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: radii.full } },
    },
    MuiToggleButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          width: '100%',
        },
      },
    },
  },
})
