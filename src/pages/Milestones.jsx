import { useState, useEffect } from 'react'
import { Star, Check, Plus, Trash2, Ruler, Weight, TrendingUp, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  getChildren, getAnswer, saveAnswer,
  getMeasurements, addMeasurement, updateMeasurement, removeMeasurement,
} from '../utils/storage'
import { getLocaleFromLang } from '../utils/ageUtils'
import { MILESTONES } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delta(current, previous, unit) {
  const c = parseFloat(current)
  const p = parseFloat(previous)
  if (isNaN(c) || isNaN(p)) return null
  const d = c - p
  if (d === 0) return null
  return (d > 0 ? '+' : '') + d.toFixed(1).replace('.0', '') + '\u00a0' + unit
}

// ─── Sparkline groeigrafiek ────────────────────────────────────────────────────

function GrowthSparkline({ measurements, color, locale }) {
  const valid = measurements.filter(m => parseFloat(m.height) > 0)
  if (valid.length < 2) return null

  const heights = valid.map(m => parseFloat(m.height))
  const minH = Math.min(...heights)
  const maxH = Math.max(...heights)
  const range = maxH - minH || 1
  const W = 280
  const H = 60
  const PAD = 10

  const pts = heights.map((h, i) => {
    const x = PAD + (i / (heights.length - 1)) * (W - PAD * 2)
    const y = PAD + (1 - (h - minH) / range) * (H - PAD * 2)
    return [x, y]
  })

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <div className="mt-2 mb-1">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={color} />
            <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">
              {heights[i]}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-text-muted px-1">
        <span>{new Date(valid[0].date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</span>
        <span>{new Date(valid[valid.length - 1].date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
  )
}

// ─── Formulier: nieuwe of bewerkte meting ─────────────────────────────────────

function MeasurementForm({ initial, onSave, onCancel }) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [date,   setDate]   = useState(initial?.date   || today)
  const [height, setHeight] = useState(initial?.height || '')
  const [weight, setWeight] = useState(initial?.weight || '')

  const canSave = date && (height || weight)

  return (
    <div className="bg-background border border-primary/20 rounded-2xl p-4 space-y-3">
      <div>
        <label className="block text-xs font-semibold text-text-muted mb-1.5">{t('milestones.date_label')}</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={today}
          className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary bg-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">{t('milestones.height_label')}</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder={t('milestones.height_placeholder')}
            step="0.5"
            min="0"
            autoFocus={!initial}
            className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">{t('milestones.weight_label')}</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder={t('milestones.weight_placeholder')}
            step="0.1"
            min="0"
            className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:border-primary bg-white"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => canSave && onSave({ date, height, weight })}
          disabled={!canSave}
          className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40 transition-opacity"
        >
          {t('common.save')}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 border border-border-light rounded-xl text-sm text-text-muted"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}

// ─── Groeicurve sectie ────────────────────────────────────────────────────────

function GrowthSection({ childId, color }) {
  const { t, i18n } = useTranslation()
  const locale = getLocaleFromLang(i18n.language)
  const [measurements, setMeasurements] = useState([])
  const [showForm,     setShowForm]     = useState(false)
  const [editingId,    setEditingId]    = useState(null)
  const [deleteId,     setDeleteId]     = useState(null)

  const reload = () => setMeasurements(getMeasurements(childId))
  useEffect(() => { reload() }, [childId])

  const handleAdd  = (data) => { addMeasurement(childId, data);            setShowForm(false); reload() }
  const handleEdit = (data) => { updateMeasurement(childId, editingId, data); setEditingId(null); reload() }
  const handleDel  = (id)   => { removeMeasurement(childId, id);           setDeleteId(null);  reload() }

  const sorted = [...measurements].reverse()

  const countKey = measurements.length === 1 ? 'milestones.measurement_count_one' : 'milestones.measurement_count_other'

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-teal" />
          <h2 className="font-bold text-text-dark">{t('milestones.growth_title')}</h2>
          {measurements.length > 0 && (
            <span className="text-xs text-text-muted bg-background px-2 py-0.5 rounded-full">
              {t(countKey, { count: measurements.length })}
            </span>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full active:bg-primary/20"
          >
            <Plus size={14} strokeWidth={2.5} />
            {t('milestones.measurement_add')}
          </button>
        )}
      </div>

      {measurements.length >= 2 && (
        <div className="px-4 pb-3 border-b border-border-light">
          <p className="text-xs text-text-muted mb-1 font-medium">{t('milestones.growth_over_time')}</p>
          <GrowthSparkline measurements={measurements} color={color} locale={locale} />
        </div>
      )}

      {showForm && (
        <div className="px-4 py-4 border-b border-border-light">
          <MeasurementForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="px-4 pb-5 text-center">
          <p className="text-sm text-text-muted">{t('milestones.measurement_empty')}</p>
        </div>
      )}

      <div className="divide-y divide-border-light">
        {sorted.map((m, i) => {
          const prev = sorted[i + 1]
          const dH = prev ? delta(m.height, prev.height, 'cm') : null
          const dW = prev ? delta(m.weight, prev.weight, 'kg') : null

          if (editingId === m.id) {
            return (
              <div key={m.id} className="px-4 py-3">
                <MeasurementForm initial={m} onSave={handleEdit} onCancel={() => setEditingId(null)} />
              </div>
            )
          }

          return (
            <div key={m.id} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-shrink-0 text-center w-12">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white block"
                  style={{ backgroundColor: color }}
                >
                  {new Date(m.date).toLocaleDateString(locale, { month: 'short' })} {String(new Date(m.date).getFullYear()).slice(2)}
                </span>
                <p className="text-sm font-bold text-text-dark mt-0.5">{new Date(m.date).getDate()}</p>
              </div>

              <div className="flex-1 flex items-center gap-4 min-w-0">
                {m.height && (
                  <div className="flex items-center gap-1.5">
                    <Ruler size={13} className="text-teal flex-shrink-0" />
                    <span className="text-sm font-semibold text-text-dark">{m.height} cm</span>
                    {dH && <span className={`text-xs font-semibold ${dH.startsWith('+') ? 'text-green' : 'text-rose'}`}>{dH}</span>}
                  </div>
                )}
                {m.weight && (
                  <div className="flex items-center gap-1.5">
                    <Weight size={13} className="text-purple flex-shrink-0" />
                    <span className="text-sm font-semibold text-text-dark">{m.weight} kg</span>
                    {dW && <span className={`text-xs font-semibold ${dW.startsWith('+') ? 'text-green' : 'text-rose'}`}>{dW}</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditingId(m.id)} className="p-1.5 text-text-muted rounded-lg active:bg-background">
                  <Pencil size={13} />
                </button>
                {deleteId === m.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDel(m.id)} className="text-xs px-2 py-1 bg-rose text-white rounded-lg font-bold">{t('common.yes')}</button>
                    <button onClick={() => setDeleteId(null)} className="text-xs px-2 py-1 border border-border-light rounded-lg text-text-muted">{t('common.no')}</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-text-muted rounded-lg active:bg-background">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Mijlpaal-kaartje ─────────────────────────────────────────────────────────

function MilestoneCard({ milestone, childId }) {
  const { t } = useTranslation()
  const [value,   setValue]   = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setValue(getAnswer(childId, 'milestones', null, null, milestone.id))
  }, [childId, milestone.id])

  const handleSave = () => {
    saveAnswer(childId, 'milestones', null, null, milestone.id, value)
    setEditing(false)
  }

  const hasFilled = value.trim().length > 0
  const milestoneText = t(`milestone_q.${milestone.id}`, { defaultValue: milestone.question })

  return (
    <div className={`bg-white rounded-2xl border p-4 transition-all ${hasFilled ? 'border-green/30' : 'border-border-light'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${hasFilled ? 'bg-green' : 'bg-background border border-border-light'}`}>
          {hasFilled
            ? <Check size={14} className="text-white" strokeWidth={3} />
            : <Star size={14} className="text-text-muted" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-dark mb-2">{milestoneText}</p>
          {editing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={t('milestones.input_placeholder')}
                className="w-full border border-primary rounded-xl px-3 py-2 text-sm text-text-dark focus:outline-none bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-primary text-white text-sm font-semibold py-2 rounded-xl">
                  {t('common.save')}
                </button>
                <button
                  onClick={() => { setEditing(false); setValue(getAnswer(childId, 'milestones', null, null, milestone.id)) }}
                  className="px-4 py-2 border border-border-light rounded-xl text-sm text-text-muted"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full text-left">
              {hasFilled
                ? <p className="text-sm text-teal font-medium">{value}</p>
                : <p className="text-sm text-text-muted italic">{t('milestones.fill_placeholder')}</p>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────

export default function Milestones() {
  const { t } = useTranslation()
  const [children,        setChildren]        = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  const selectedChild = children.find(c => c.id === selectedChildId)

  const filledMilestones = selectedChild
    ? MILESTONES.filter(m => {
        const ans = getAnswer(selectedChildId, 'milestones', null, null, m.id)
        return ans && ans.trim()
      }).length
    : 0

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">{t('milestones.subtitle')}</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          {t('milestones.title')} <Star size={20} className="text-yellow" />
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
            <p className="font-semibold text-text-dark">{t('milestones.none')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <ChildAvatar child={selectedChild} size="lg" />
              <div>
                <p className="font-bold text-text-dark text-lg">{selectedChild.name}</p>
                <p className="text-sm text-text-muted">
                  {t('milestones.filled', { filled: filledMilestones, total: MILESTONES.length })}
                </p>
              </div>
            </div>

            <GrowthSection childId={selectedChildId} color={selectedChild.color} />

            <h2 className="font-bold text-text-dark mt-6 mb-1">{t('milestones.first_time')}</h2>
            <div className="h-1.5 bg-border-light rounded-full mb-4">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((filledMilestones / MILESTONES.length) * 100)}%`,
                  backgroundColor: selectedChild.color,
                }}
              />
            </div>
            <div className="space-y-3">
              {MILESTONES.map(m => (
                <MilestoneCard key={m.id} milestone={m} childId={selectedChildId} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
