import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App.tsx'
import { GlobalStyles } from './styles/GlobalStyles'
import { appTheme } from './styles/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </StrictMode>
)
