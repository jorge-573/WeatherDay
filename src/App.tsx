import { lazy, Suspense } from 'react'
import Typography from '@mui/material/Typography'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

const Radar = lazy(() => import('./pages/Radar').then((module) => ({ default: module.Radar })))

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="radar"
          element={
            <Suspense
              fallback={
                <Typography sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>Loading radar…</Typography>
              }
            >
              <Radar />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
