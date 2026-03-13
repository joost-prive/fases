import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SeasonProvider, useSeason } from './contexts/SeasonContext'
import { isOnboardingComplete } from './utils/storage'
import Navigation from './components/Navigation'
import AppLogo from './components/AppLogo'
import SeasonalBackground from './components/SeasonalBackground'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import MonthlyQuestions from './pages/MonthlyQuestions'
import History from './pages/History'
import Children from './pages/Children'
import Milestones from './pages/Milestones'
import Birthday from './pages/Birthday'
import Settings from './pages/Settings'
import Book from './pages/Book'

function LoadingScreen() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-3">
        <AppLogo size={48} />
        <p className="text-text-muted text-sm">{t('app.loading')}</p>
      </div>
    </div>
  )
}

// Beschermde route: ingelogd + onboarding afgerond
function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()
  const { activeSeason } = useSeason()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!isOnboardingComplete()) return <Navigate to="/welkom" replace />

  return (
    <>
      <SeasonalBackground season={activeSeason} />
      <div className="max-w-lg mx-auto flex-1">
        {children}
      </div>
      <Navigation />
    </>
  )
}

// Alleen voor niet-ingelogde gebruikers (login / welkom)
function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />
  return children
}

// Onboarding: ingelogd maar nog geen onboarding
function OnboardingRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/welkom" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
      <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
      <Route path="/vragen" element={<ProtectedLayout><MonthlyQuestions /></ProtectedLayout>} />
      <Route path="/vragen/:month" element={<ProtectedLayout><MonthlyQuestions /></ProtectedLayout>} />
      <Route path="/tijdreis" element={<ProtectedLayout><History /></ProtectedLayout>} />
      <Route path="/kinderen" element={<ProtectedLayout><Children /></ProtectedLayout>} />
      <Route path="/mijlpalen" element={<ProtectedLayout><Milestones /></ProtectedLayout>} />
      <Route path="/verjaardag" element={<ProtectedLayout><Birthday /></ProtectedLayout>} />
      <Route path="/instellingen" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
      <Route path="/boek" element={<ProtectedLayout><Book /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SeasonProvider>
          <AppRoutes />
        </SeasonProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
