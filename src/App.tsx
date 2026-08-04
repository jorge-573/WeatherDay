import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { StatusMessage } from './components/shared'
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
            <Suspense fallback={<StatusMessage>Loading radar…</StatusMessage>}>
              <Radar />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
