import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, X, Check, Users } from 'lucide-react'
import { getChildren, addChild, updateChild, removeChild } from '../utils/storage'
import { getAgeText, formatBirthdate } from '../utils/ageUtils'
import { CHILD_COLORS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function AddChildModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [color, setColor] = useState(CHILD_COLORS[0])
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!name.trim()) return setError('Vul een naam in')
    if (!birthdate) return setError('Vul een geboortedatum in')
    onSave({ name: name.trim(), birthdate, color })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-text-dark text-xl">Kind toevoegen</h2>
          <button onClick={onClose} className="text-text-muted">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Naam</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Naam van het kind"
              className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark placeholder-text-muted focus:outline-none focus:border-primary bg-background text-base"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Geboortedatum</label>
            <input
              type="date"
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-border-light rounded-2xl px-4 py-3 text-text-dark focus:outline-none focus:border-primary bg-background text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">Kleur</label>
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
                {birthdate && <p className="text-sm text-text-muted">{formatBirthdate(birthdate)}</p>}
              </div>
            </div>
          )}

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
          >
            <Check size={18} /> Toevoegen
          </button>
        </div>
      </div>
    </div>
  )
}

function ChildCard({ child, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-white rounded-3xl border border-border-light p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <ChildAvatar child={child} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-dark text-lg">{child.name}</p>
          <p className="text-text-muted text-sm">{getAgeText(child.birthdate)}</p>
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
            {child.name} verwijderen?
          </p>
          <p className="text-xs text-text-muted mb-3">
            Alle antwoorden voor {child.name} worden ook verwijderd. Dit kan niet ongedaan worden gemaakt.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 rounded-xl border border-border-light text-sm font-medium text-text-muted bg-white"
            >
              Annuleer
            </button>
            <button
              onClick={() => { onDelete(child.id); setConfirmDelete(false) }}
              className="flex-1 py-2 rounded-xl bg-rose text-white text-sm font-semibold"
            >
              Verwijderen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Children() {
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
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">Beheer</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          Kinderen <Users size={20} className="text-primary" />
        </h1>
      </div>

      <div className="px-5 py-5">
        {children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">👶</p>
            <p className="font-semibold text-text-dark mb-2">Nog geen kinderen</p>
            <p className="text-text-muted text-sm mb-6">Voeg je eerste kind toe</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={setEditChild}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={20} /> Kind toevoegen
        </button>

        <div className="mt-6 bg-teal/5 border border-teal/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-text-dark mb-1">💡 Gezinsuitbreiding?</p>
          <p className="text-sm text-text-muted leading-relaxed">
            Voeg een nieuw kindje toe en het wordt automatisch meegenomen in jouw tijdreis.
            Je ziet meteen hoe ze op dezelfde leeftijd op elkaar lijken of juist van elkaar verschilden.
          </p>
        </div>
      </div>

      {showAddModal && (
        <AddChildModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
    </div>
  )
}
