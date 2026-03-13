import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit3, X, Check, Users, Camera, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getChildren, addChild, updateChild, removeChild, saveChildPhotoUrl, clearChildPhotoUrl } from '../utils/storage'
import { uploadProfilePhoto, deleteProfilePhoto } from '../utils/photoService'
import { useAuth } from '../contexts/AuthContext'
import { getAgeText, formatBirthdate, getLocaleFromLang } from '../utils/ageUtils'
import { CHILD_COLORS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function AddChildModal({ onClose, onSave }) {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [color, setColor] = useState(CHILD_COLORS[0])
  const [error, setError] = useState('')

  const locale = getLocaleFromLang(i18n.language)

  const handleSave = () => {
    if (!name.trim()) return setError(t('children.error_name'))
    if (!birthdate) return setError(t('children.error_birthdate'))
    onSave({ name: name.trim(), birthdate, color })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-text-dark text-xl">{t('children.modal_title')}</h2>
          <button onClick={onClose} className="text-text-muted">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">{t('children.name_label')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('children.name_placeholder')}
              className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark placeholder-text-muted focus:outline-none focus:border-primary bg-background text-base"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">{t('children.birthdate_label')}</label>
            <input
              type="date"
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark focus:outline-none focus:border-primary bg-background text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">{t('children.color_label')}</label>
            <div className="flex gap-3 flex-wrap">
              {CHILD_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <div className="w-3 h-3 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {name && (
            <div className="bg-background rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: color }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-text-dark">{name}</p>
                {birthdate && <p className="text-sm text-text-muted">{formatBirthdate(birthdate, locale)}</p>}
              </div>
            </div>
          )}

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
          >
            <Check size={18} /> {t('children.add_confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ChildCard({ child, onEdit, onDelete, onRefresh }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const photoInputRef = useRef(null)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 15 * 1024 * 1024) return
    setPhotoLoading(true)
    try {
      const url = await uploadProfilePhoto(user.uid, child.id, file)
      saveChildPhotoUrl(child.id, url)
      onRefresh?.()
    } catch (err) {
      console.error('Foto uploaden mislukt', err)
    } finally {
      setPhotoLoading(false)
      e.target.value = ''
    }
  }

  const handlePhotoDelete = async () => {
    if (!user) return
    setPhotoLoading(true)
    try {
      await deleteProfilePhoto(user.uid, child.id)
      clearChildPhotoUrl(child.id)
      onRefresh?.()
    } catch (err) {
      console.error('Foto verwijderen mislukt', err)
    } finally {
      setPhotoLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-border-light p-5 shadow-sm">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <ChildAvatar child={child} size="lg" />
          {photoLoading ? (
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
              <Loader2 size={18} className="text-white animate-spin" />
            </div>
          ) : (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm"
              title={child.photo ? t('children.photo_change') : t('children.photo_add')}
            >
              <Camera size={12} className="text-white" />
            </button>
          )}
          {child.photo && !photoLoading && (
            <button
              onClick={handlePhotoDelete}
              className="absolute top-0 right-0 w-5 h-5 rounded-full bg-rose flex items-center justify-center shadow-sm"
              title={t('children.photo_delete')}
            >
              <X size={9} className="text-white" />
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-dark text-lg">{child.name}</p>
          <p className="text-text-muted text-sm">{getAgeText(child.birthdate, t)}</p>
          <p className="text-text-muted text-xs">{formatBirthdate(child.birthdate)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(child)}
            className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text-muted active:bg-border-light"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center text-rose active:bg-rose/20"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="mt-4 bg-rose/5 border border-rose/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-text-dark mb-1">
            {t('children.delete_confirm', { name: child.name })}
          </p>
          <p className="text-xs text-text-muted mb-3">
            {t('children.delete_desc', { name: child.name })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 rounded-xl border border-border-light text-sm font-medium text-text-muted bg-white"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => { onDelete(child.id); setConfirmDelete(false) }}
              className="flex-1 py-2 rounded-xl bg-rose text-white text-sm font-semibold"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Children() {
  const { t } = useTranslation()
  const [children, setChildren] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editChild, setEditChild] = useState(null)

  const refresh = () => setChildren(getChildren())

  useEffect(() => { refresh() }, [])

  const handleAdd = (childData) => {
    addChild(childData)
    refresh()
  }

  const handleDelete = (id) => {
    removeChild(id)
    refresh()
  }

  return (
    <div className="min-h-screen pb-24 page-enter">
      <div className="bg-white/90 backdrop-blur-md border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">{t('children.subtitle')}</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          {t('children.title')} <Users size={20} className="text-primary" />
        </h1>
      </div>

      <div className="px-5 py-5">
        {children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">👶</p>
            <p className="font-semibold text-text-dark mb-2">{t('children.empty')}</p>
            <p className="text-text-muted text-sm mb-6">{t('children.empty_desc')}</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={setEditChild}
                onDelete={handleDelete}
                onRefresh={refresh}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={20} /> {t('children.add_btn')}
        </button>

        <div className="mt-6 bg-teal/5 border border-teal/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-text-dark mb-1">{t('children.tip_title')}</p>
          <p className="text-sm text-text-muted leading-relaxed">{t('children.tip_desc')}</p>
        </div>
      </div>

      {showAddModal && (
        <AddChildModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}
