import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { getChildren, getData } from '../utils/storage'
import { getAgeInMonth } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS, BIRTHDAY_QUESTIONS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function QuestionHistory({ question, allYearAnswers, child }) {
  const [expanded, setExpanded] = useState(false)
  const entries = Object.entries(allYearAnswers)
    .filter(([, answers]) => answers[question.id])
    .sort(([a], [b]) => b - a)

  if (entries.length === 0) return null

  return (
    <div className="border-b border-border-light last:border-0">
      <button
        className="w-full flex items-start gap-3 py-3 px-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <p className="text-sm font-medium text-text-dark leading-snug">{question.question}</p>
          <p className="text-xs text-text-muted mt-0.5">{entries.length} jaar{entries.length !== 1 ? 'en' : ''} ingevuld</p>
        </div>
        <div className="text-text-muted flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {entries.map(([year, answers]) => {
            const age = getAgeInMonth(child.birthdate, year, 'Januari')
            return (
              <div key={year} className="bg-background rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-primary">{year}</span>
                  <span className="text-xs text-text-muted">• {age} jaar</span>
                </div>
                <p className="text-sm text-text-dark leading-relaxed">{answers[question.id]}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MonthHistory({ month, childId, child }) {
  const [expanded, setExpanded] = useState(false)
  const data = getData()
  const monthly = data.answers[childId]?.monthly || {}

  // Collect all answers for this month across years
  const allYearAnswers = {}
  for (const year of Object.keys(monthly)) {
    allYearAnswers[year] = monthly[year][month] || {}
  }

  const hasAnyAnswer = Object.values(allYearAnswers).some(a => Object.values(a).some(v => v))
  if (!hasAnyAnswer) return null

  const yearsWithAnswers = Object.entries(allYearAnswers)
    .filter(([, a]) => Object.values(a).some(v => v))
    .length

  const questions = MONTHLY_QUESTIONS[month] || []

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-bold text-text-dark">{month}</h3>
          <p className="text-xs text-text-muted">{yearsWithAnswers} jaar ingevuld</p>
        </div>
        {expanded ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
      </button>

      {expanded && (
        <div>
          {questions.map(q => (
            <QuestionHistory
              key={q.id}
              question={q}
              allYearAnswers={allYearAnswers}
              child={child}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  const selectedChild = children.find(c => c.id === selectedChildId)

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      {/* Header */}
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">Terugkijken</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          Tijdreis <Clock size={20} className="text-teal" />
        </h1>

        {/* Child selector */}
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
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⏳</p>
            <p className="font-semibold text-text-dark">Nog geen kinderen</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5 bg-white rounded-2xl p-4 border border-border-light">
              <ChildAvatar child={selectedChild} size="lg" />
              <div>
                <p className="font-bold text-text-dark text-lg">{selectedChild.name}</p>
                <p className="text-sm text-text-muted">
                  Geboren {new Date(selectedChild.birthdate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <h2 className="font-bold text-text-dark mb-3">Per maand</h2>
            <div className="space-y-3">
              {MONTHS.map(month => (
                <MonthHistory
                  key={month}
                  month={month}
                  childId={selectedChildId}
                  child={selectedChild}
                />
              ))}
            </div>

            {/* Birthday history */}
            {(() => {
              const data = getData()
              const birthdayAnswers = data.answers[selectedChildId]?.birthday || {}
              const hasAny = Object.values(birthdayAnswers).some(y => Object.values(y).some(v => v))
              if (!hasAny) return null
              return (
                <div className="mt-6">
                  <h2 className="font-bold text-text-dark mb-3">🎂 Verjaardagen</h2>
                  <div className="bg-white rounded-2xl border border-yellow/30 overflow-hidden shadow-sm">
                    {BIRTHDAY_QUESTIONS.map(q => (
                      <QuestionHistory
                        key={q.id}
                        question={q}
                        allYearAnswers={birthdayAnswers}
                        child={selectedChild}
                      />
                    ))}
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </div>
    </div>
  )
}
