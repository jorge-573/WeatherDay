import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { StatusMessage } from './components/shared'
import { Home } from './pages/Home'

const Radar = lazy(() => import('./pages/Radar').then((module) => ({ default: module.Radar })))
const Outlooks = lazy(() => import('./pages/Outlooks').then((module) => ({ default: module.Outlooks })))

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
        <Route
          path="outlooks"
          element={
            <Suspense fallback={<StatusMessage>Loading outlooks…</StatusMessage>}>
              <Outlooks />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
