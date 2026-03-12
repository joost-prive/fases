import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isOnboardingComplete } from './utils/storage'
import Navigation from './components/Navigation'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import MonthlyQuestions from './pages/MonthlyQuestions'
import History from './pages/History'
import Children from './pages/Children'
import Milestones from './pages/Milestones'
import Birthday from './pages/Birthday'
import Settings from './pages/Settings'

function ProtectedLayout({ children }) {
  if (!isOnboardingComplete()) {
    return <Navigate to="/welkom" replace />
  }
  return (
    <>
      <div className="max-w-lg mx-auto flex-1">
        {children}
      </div>
      <Navigation />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welkom" element={<Onboarding />} />
        <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/vragen" element={<ProtectedLayout><MonthlyQuestions /></ProtectedLayout>} />
        <Route path="/vragen/:month" element={<ProtectedLayout><MonthlyQuestions /></ProtectedLayout>} />
        <Route path="/tijdreis" element={<ProtectedLayout><History /></ProtectedLayout>} />
        <Route path="/kinderen" element={<ProtectedLayout><Children /></ProtectedLayout>} />
        <Route path="/mijlpalen" element={<ProtectedLayout><Milestones /></ProtectedLayout>} />
        <Route path="/verjaardag" element={<ProtectedLayout><Birthday /></ProtectedLayout>} />
        <Route path="/instellingen" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
