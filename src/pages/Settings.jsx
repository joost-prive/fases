import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Trash2, Download, Info, LogOut } from 'lucide-react'
import { getSettings, saveSettings, getData } from '../utils/storage'
import { logout } from '../utils/authService'
import { useAuth } from '../contexts/AuthContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border-light'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-light last:border-0">
      <div className="flex-1 pr-4">
        <p className="font-medium text-text-dark text-sm">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(getSettings())
  const [exportDone, setExportDone] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  const update = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    saveSettings(updated)
  }

  const handleExport = () => {
    const data = getData()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fases-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 3000)
  }

  const handleClearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const REMINDER_DAYS = [
    { value: 1, label: '1e van de maand' },
    { value: 7, label: '7e van de maand' },
    { value: 15, label: '15e van de maand' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">Voorkeuren</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          Instellingen <SettingsIcon size={20} className="text-text-muted" />
        </h1>
      </div>

      <div className="px-5 py-5 space-y-4">

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h2 className="font-bold text-text-dark">Herinneringen</h2>
          </div>

          <SettingRow
            label="Maandelijkse herinnering"
            description="Ontvang een melding wanneer nieuwe vragen beschikbaar zijn"
          >
            <Toggle
              checked={settings.notificationsEnabled}
              onChange={v => update('notificationsEnabled', v)}
            />
          </SettingRow>

          {settings.notificationsEnabled && (
            <div className="pt-2">
              <p className="text-xs font-semibold text-text-muted mb-2">Herinner mij op</p>
              <div className="flex gap-2 flex-wrap">
                {REMINDER_DAYS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => update('reminderDay', d.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      settings.reminderDay === d.value
                        ? 'bg-primary text-white border-transparent'
                        : 'text-text-muted border-border-light'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">
                Notificaties werken wanneer de app als PWA is geïnstalleerd op je toestel.
              </p>
            </div>
          )}
        </div>

        {/* Data */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Download size={18} className="text-teal" />
            <h2 className="font-bold text-text-dark">Jouw gegevens</h2>
          </div>

          <button
            onClick={handleExport}
            className={`w-full py-3 rounded-2xl text-sm font-semibold border transition-all ${
              exportDone
                ? 'bg-green/10 text-green border-green/30'
                : 'bg-teal/5 text-teal border-teal/20 active:bg-teal/10'
            }`}
          >
            {exportDone ? '✓ Download gestart!' : 'Exporteer als JSON backup'}
          </button>

          <p className="text-xs text-text-muted mt-3">
            Al je antwoorden worden lokaal opgeslagen op dit apparaat. Exporteer regelmatig een backup.
          </p>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-rose/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={18} className="text-rose" />
            <h2 className="font-bold text-text-dark">Gegevens verwijderen</h2>
          </div>

          {!clearConfirm ? (
            <button
              onClick={() => setClearConfirm(true)}
              className="w-full py-3 rounded-2xl text-sm font-semibold bg-rose/5 text-rose border border-rose/20 active:bg-rose/10"
            >
              Alle gegevens wissen
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-dark font-semibold">Weet je het zeker?</p>
              <p className="text-xs text-text-muted">Alle kinderen, vragen en antwoorden worden permanent verwijderd.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border-light text-sm font-medium text-text-muted"
                >
                  Annuleer
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2.5 rounded-xl bg-rose text-white text-sm font-semibold"
                >
                  Alles wissen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LogOut size={18} className="text-text-muted" />
            <h2 className="font-bold text-text-dark">Account</h2>
          </div>
          {user && (
            <p className="text-sm text-text-muted mb-3">
              Ingelogd als <span className="font-medium text-text-dark">{user.displayName || user.email}</span>
            </p>
          )}
          <button
            onClick={() => logout()}
            className="w-full py-3 rounded-2xl text-sm font-semibold bg-background text-text-dark border border-border-light active:bg-border-light"
          >
            Uitloggen
          </button>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-text-muted" />
            <h2 className="font-bold text-text-dark">Over Fases</h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            Fases is een maandboek voor drukke ouders. Geen dagboek, maar een paar vragen per maand —
            wanneer het jou uitkomt. Het resultaat: een prachtige tijdreis van jouw opgroeiende gezin.
          </p>
          <p className="text-xs text-text-muted mt-3">Versie 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
