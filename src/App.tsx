import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import OnboardingModal from './components/OnboardingModal'
import Dashboard from './pages/Dashboard'
import PensumPage from './pages/PensumPage'
import PrelacionesPage from './pages/PrelacionesPage'
import TrabajoDeGradoPage from './pages/TrabajoDeGradoPage'
import RequisitosPage from './pages/RequisitosPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pensum" element={<PensumPage />} />
          <Route path="prelaciones" element={<PrelacionesPage />} />
          <Route path="trabajo-de-grado" element={<TrabajoDeGradoPage />} />
          <Route path="requisitos" element={<RequisitosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <OnboardingModal />
      <Analytics />
    </BrowserRouter>
  )
}
