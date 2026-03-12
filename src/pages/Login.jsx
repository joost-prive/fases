import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import KidCharacter from '../components/KidCharacter'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
} from '../utils/authService'

export default function Login() {
  const [tab, setTab] = useState('login') // 'login' | 'register' | 'reset'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleError = (e) => {
    const msg = {
      'auth/user-not-found': 'Geen account gevonden met dit e-mailadres.',
      'auth/wrong-password': 'Wachtwoord klopt niet.',
      'auth/invalid-credential': 'E-mail of wachtwoord klopt niet.',
      'auth/email-already-in-use': 'Dit e-mailadres is al in gebruik.',
      'auth/weak-password': 'Kies een wachtwoord van minimaal 6 tekens.',
      'auth/invalid-email': 'Ongeldig e-mailadres.',
      'auth/popup-closed-by-user': 'Inloggen via Google geannuleerd.',
      'auth/network-request-failed': 'Geen internetverbinding.',
    }[e.code] || 'Er ging iets mis. Probeer het opnieuw.'
    setError(msg)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(form.email, form.password)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerWithEmail(form.email, form.password, form.name)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(form.email)
      setResetSent(true)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-12">
      {/* Karakters + header */}
      <div className="mb-8 text-center">
        <div className="flex items-end justify-center gap-3 mb-4">
          <KidCharacter phase="baby"       color="#E07845" width={44} />
          <KidCharacter phase="kleuter"    color="#5A9EA0" width={58} />
          <KidCharacter phase="schoolkind" color="#9B7EC8" width={44} />
        </div>
        <h1 className="text-3xl font-bold text-text-dark">Fases</h1>
        <p className="text-text-muted text-sm mt-1">Jouw maandboek voor je gezin</p>
      </div>

      <div className="w-full max-w-sm">
        {/* Tabs: Inloggen / Registreren */}
        {tab !== 'reset' && (
          <div className="flex bg-white rounded-2xl border border-border-light p-1 mb-5">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted'
                }`}
              >
                {t === 'login' ? 'Inloggen' : 'Registreren'}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-border-light shadow-sm p-6">
          {/* Foutmelding */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* INLOGGEN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField icon={<Mail size={16} />} type="email" placeholder="E-mailadres" value={form.email} onChange={set('email')} required />
              <div className="relative">
                <InputField icon={<Lock size={16} />} type={showPassword ? 'text' : 'password'} placeholder="Wachtwoord" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-3 rounded-2xl shadow-sm disabled:opacity-60 transition-opacity">
                {loading ? 'Even geduld…' : 'Inloggen'}
              </button>
              <button type="button" onClick={() => { setTab('reset'); setError(''); setResetSent(false) }} className="w-full text-sm text-text-muted text-center">
                Wachtwoord vergeten?
              </button>
            </form>
          )}

          {/* REGISTREREN */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <InputField icon={<User size={16} />} type="text" placeholder="Jouw naam" value={form.name} onChange={set('name')} required />
              <InputField icon={<Mail size={16} />} type="email" placeholder="E-mailadres" value={form.email} onChange={set('email')} required />
              <div className="relative">
                <InputField icon={<Lock size={16} />} type={showPassword ? 'text' : 'password'} placeholder="Wachtwoord (min. 6 tekens)" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-3 rounded-2xl shadow-sm disabled:opacity-60 transition-opacity">
                {loading ? 'Account aanmaken…' : 'Account aanmaken'}
              </button>
            </form>
          )}

          {/* WACHTWOORD RESET */}
          {tab === 'reset' && (
            <div>
              <button onClick={() => { setTab('login'); setError('') }} className="text-sm text-text-muted mb-4 flex items-center gap-1">
                ← Terug naar inloggen
              </button>
              <h2 className="font-bold text-text-dark mb-1">Wachtwoord vergeten?</h2>
              <p className="text-sm text-text-muted mb-4">Vul je e-mailadres in en we sturen je een resetlink.</p>
              {resetSent ? (
                <div className="bg-green/10 border border-green/30 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-2">✉️</p>
                  <p className="font-semibold text-text-dark text-sm">E-mail verstuurd!</p>
                  <p className="text-xs text-text-muted mt-1">Controleer je inbox (en spammap).</p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <InputField icon={<Mail size={16} />} type="email" placeholder="E-mailadres" value={form.email} onChange={set('email')} required />
                  <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-3 rounded-2xl shadow-sm disabled:opacity-60">
                    {loading ? 'Versturen…' : 'Resetlink sturen'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Google-knop (login + register) */}
          {tab !== 'reset' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border-light" />
                <span className="text-xs text-text-muted">of</span>
                <div className="flex-1 h-px bg-border-light" />
              </div>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-border-light rounded-2xl py-3 text-sm font-semibold text-text-dark bg-white hover:bg-background transition-colors disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Doorgaan met Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function InputField({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>
      <input
        {...props}
        className="w-full bg-background border border-border-light rounded-xl pl-9 pr-4 py-3 text-sm text-text-dark placeholder-text-muted focus:outline-none focus:border-primary"
      />
    </div>
  )
}
