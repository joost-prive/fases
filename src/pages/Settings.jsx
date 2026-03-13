import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Trash2, Download, Info, LogOut, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getSettings, saveSettings, getData } from '../utils/storage'
import { logout } from '../utils/authService'
import { useAuth } from '../contexts/AuthContext'
import { setLanguage } from '../i18n'

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
  const { t, i18n } = useTranslation()
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
    { value: 1,  label: t('settings.reminder_day_1') },
    { value: 7,  label: t('settings.reminder_day_7') },
    { value: 15, label: t('settings.reminder_day_15') },
  ]

  const LANGUAGES = [
    { code: 'nl', label: t('settings.language_nl') },
    { code: 'en', label: t('settings.language_en') },
    { code: 'de', label: t('settings.language_de') },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">{t('settings.subtitle')}</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          {t('settings.title')} <SettingsIcon size={20} className="text-text-muted" />
        </h1>
      </div>

      <div className="px-5 py-5 space-y-4">

        {/* Taal */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-primary" />
            <h2 className="font-bold text-text-dark">{t('settings.language_title')}</h2>
          </div>
          <p className="text-xs font-semibold text-text-muted mb-2">{t('settings.language_label')}</p>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  i18n.language === lang.code
                    ? 'bg-primary text-white border-transparent'
                    : 'text-text-muted border-border-light'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Herinneringen */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h2 className="font-bold text-text-dark">{t('settings.reminders_title')}</h2>
          </div>

          <SettingRow
            label={t('settings.reminder_label')}
            description={t('settings.reminder_desc')}
          >
            <Toggle
              checked={settings.notificationsEnabled}
              onChange={v => update('notificationsEnabled', v)}
            />
          </SettingRow>

          {settings.notificationsEnabled && (
            <div className="pt-2">
              <p className="text-xs font-semibold text-text-muted mb-2">{t('settings.reminder_on')}</p>
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
              <p className="text-xs text-text-muted mt-3">{t('settings.pwa_note')}</p>
            </div>
          )}
        </div>

        {/* Data */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Download size={18} className="text-teal" />
            <h2 className="font-bold text-text-dark">{t('settings.data_title')}</h2>
          </div>

          <button
            onClick={handleExport}
            className={`w-full py-3 rounded-2xl text-sm font-semibold border transition-all ${
              exportDone
                ? 'bg-green/10 text-green border-green/30'
                : 'bg-teal/5 text-teal border-teal/20 active:bg-teal/10'
            }`}
          >
            {exportDone ? t('settings.export_done') : t('settings.export_btn')}
          </button>

          <p className="text-xs text-text-muted mt-3">{t('settings.export_note')}</p>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-rose/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={18} className="text-rose" />
            <h2 className="font-bold text-text-dark">{t('settings.danger_title')}</h2>
          </div>

          {!clearConfirm ? (
            <button
              onClick={() => setClearConfirm(true)}
              className="w-full py-3 rounded-2xl text-sm font-semibold bg-rose/5 text-rose border border-rose/20 active:bg-rose/10"
            >
              {t('settings.clear_btn')}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-dark font-semibold">{t('settings.clear_confirm')}</p>
              <p className="text-xs text-text-muted">{t('settings.clear_desc')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border-light text-sm font-medium text-text-muted"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2.5 rounded-xl bg-rose text-white text-sm font-semibold"
                >
                  {t('settings.clear_yes')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LogOut size={18} className="text-text-muted" />
            <h2 className="font-bold text-text-dark">{t('settings.account_title')}</h2>
          </div>
          {user && (
            <p className="text-sm text-text-muted mb-3">
              {t('settings.logged_in_as', { name: user.displayName || user.email })}
            </p>
          )}
          <button
            onClick={() => logout()}
            className="w-full py-3 rounded-2xl text-sm font-semibold bg-background text-text-dark border border-border-light active:bg-border-light"
          >
            {t('settings.logout')}
          </button>
        </div>

        {/* Over Fases */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-text-muted" />
            <h2 className="font-bold text-text-dark">{t('settings.about_title')}</h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{t('settings.about_desc')}</p>
          <p className="text-xs text-text-muted mt-3">{t('settings.version')}</p>
        </div>
      </div>
    </div>
  )
}
