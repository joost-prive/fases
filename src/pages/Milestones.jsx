import { useState, useEffect } from 'react'
import { Star, Check } from 'lucide-react'
import { getChildren, getAnswer, saveAnswer } from '../utils/storage'
import { MILESTONES } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function MilestoneCard({ milestone, childId, child }) {
  const [value, setValue] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const saved = getAnswer(childId, 'milestones', null, null, milestone.id)
    setValue(saved)
  }, [childId, milestone.id])

  const handleSave = () => {
    saveAnswer(childId, 'milestones', null, null, milestone.id, value)
    setEditing(false)
  }

  const hasFilled = value.trim().length > 0

  return (
    <div className={`bg-white rounded-2xl border p-4 transition-all ${
      hasFilled ? 'border-green/30' : 'border-border-light'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          hasFilled ? 'bg-green' : 'bg-background border border-border-light'
        }`}>
          {hasFilled ? <Check size={14} className="text-white" strokeWidth={3} /> : (
            <Star size={14} className="text-text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-dark mb-2">{milestone.question}</p>

          {editing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Bijv. 6 weken, 3 april 2023..."
                className="w-full border border-primary rounded-xl px-3 py-2 text-sm text-text-dark focus:outline-none bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary text-white text-sm font-semibold py-2 rounded-xl"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => { setEditing(false); setValue(getAnswer(childId, 'milestones', null, null, milestone.id)) }}
                  className="px-4 py-2 border border-border-light rounded-xl text-sm text-text-muted"
                >
                  Annuleer
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full text-left"
            >
              {hasFilled ? (
                <p className="text-sm text-teal font-medium">{value}</p>
              ) : (
                <p className="text-sm text-text-muted italic">Tik om in te vullen...</p>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StatInput({ childId, year, stat }) {
  const [val, setVal] = useState(() => getAnswer(childId, 'stats', year, null, stat.id))
  return (
    <div>
      <p className="text-xs text-text-muted mb-1">{stat.label}</p>
      <input
        type="text"
        value={val}
        onChange={e => {
          setVal(e.target.value)
          saveAnswer(childId, 'stats', year, null, stat.id, e.target.value)
        }}
        placeholder={stat.placeholder}
        className="w-full border border-border-light rounded-xl px-3 py-2 text-sm text-text-dark focus:outline-none focus:border-primary bg-background"
      />
    </div>
  )
}

// Stats card (height, weight etc.)
function StatsCard({ childId, year }) {
  const stats = [
    { id: 'height', label: 'Lengte', placeholder: 'bijv. 95 cm' },
    { id: 'weight', label: 'Gewicht', placeholder: 'bijv. 14 kg' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-border-light p-4">
      <h3 className="font-bold text-text-dark mb-3">{year} — Groei</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <StatInput key={stat.id} childId={childId} year={year} stat={stat} />
        ))}
      </div>
    </div>
  )
}

export default function Milestones() {
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  const selectedChild = children.find(c => c.id === selectedChildId)

  const filled = selectedChild
    ? MILESTONES.filter(m => {
        const ans = getAnswer(selectedChildId, 'milestones', null, null, m.id)
        return ans && ans.trim()
      }).length
    : 0

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">Bijzondere momenten</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          Mijlpalen <Star size={20} className="text-yellow" />
        </h1>

        {children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  child.id === selectedChildId
                    ? 'border-transparent text-white'
                    : 'border-border-light text-text-muted bg-white'
                }`}
                style={child.id === selectedChildId ? { backgroundColor: child.color } : {}}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-5">
        {!selectedChild ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">⭐</p>
            <p className="font-semibold text-text-dark">Geen kinderen gevonden</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <ChildAvatar child={selectedChild} size="lg" />
              <div>
                <p className="font-bold text-text-dark text-lg">{selectedChild.name}</p>
                <p className="text-sm text-text-muted">{filled} van {MILESTONES.length} mijlpalen</p>
              </div>
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-border-light rounded-full mb-6">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.round((filled / MILESTONES.length) * 100)}%`, backgroundColor: selectedChild.color }}
              />
            </div>

            {/* Stats */}
            <StatsCard childId={selectedChildId} year={currentYear} />

            <h2 className="font-bold text-text-dark mt-6 mb-3">Eerste keer dat ik...</h2>
            <div className="space-y-3">
              {MILESTONES.map(m => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  childId={selectedChildId}
                  child={selectedChild}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
