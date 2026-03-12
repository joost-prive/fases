import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { getChildren, getAnswer, saveAnswer, getMonthAnswersAllYears } from '../utils/storage'
import { filterQuestionsForAge, getCurrentMonthName, getCurrentYear } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function PreviousAnswers({ childId, month, questionId, currentYear }) {
  const allYears = getMonthAnswersAllYears(childId, month)
  const entries = Object.entries(allYears)
    .filter(([year, answers]) => parseInt(year) !== currentYear && answers[questionId])
    .sort(([a], [b]) => b - a)
  if (entries.length === 0) return null
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Vorige jaren</p>
      {entries.map(([year, answers]) => (
        <div key={year} className="bg-teal/5 border border-teal/20 rounded-xl px-3 py-2.5">
          <p className="text-xs font-semibold text-teal mb-1">{year}</p>
          <p className="text-sm text-text-dark leading-relaxed">{answers[questionId]}</p>
        </div>
      ))}
    </div>
  )
}

function QuestionCard({ question, childId, month, year, isOpen, onToggle }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(getAnswer(childId, 'monthly', year, month, question.id))
  }, [childId, month, year, question.id])

  const handleChange = (e) => {
    setValue(e.target.value)
    saveAnswer(childId, 'monthly', year, month, question.id, e.target.value)
  }

  const hasAnswer = value.trim().length > 0

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-primary shadow-sm' : 'border-border-light'}`}>
      <button className="w-full flex items-start gap-3 p-4 text-left" onClick={onToggle}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${hasAnswer ? 'bg-green' : 'bg-background border border-border-light'}`}>
          {hasAnswer
            ? <Check size={13} className="text-white" strokeWidth={3} />
            : <span className="text-xs text-text-muted font-medium">{question.id}</span>}
        </div>
        <p className={`flex-1 text-sm leading-snug font-medium ${isOpen ? 'text-primary' : 'text-text-dark'}`}>
          {question.question}
        </p>
        <div className="text-text-muted flex-shrink-0 mt-0.5">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Schrijf hier je antwoord..."
            rows={4}
            autoFocus
            className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark placeholder-text-muted focus:outline-none focus:border-primary bg-background resize-none"
          />
          <PreviousAnswers childId={childId} month={month} questionId={question.id} currentYear={year} />
        </div>
      )}
    </div>
  )
}

export default function MonthlyQuestions() {
  const [params, setParams] = useSearchParams()
  const { month: monthParam } = useParams()

  const currentMonth = getCurrentMonthName()
  const currentYear = getCurrentYear()

  const [selectedMonth, setSelectedMonth] = useState(monthParam || params.get('month') || currentMonth)
  const [selectedYear, setSelectedYear] = useState(parseInt(params.get('year') || currentYear))
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(params.get('childId') || null)
  const [openQuestion, setOpenQuestion] = useState(null)

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (!selectedChildId && all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  // Reset open question when month/year/child changes
  useEffect(() => { setOpenQuestion(null) }, [selectedMonth, selectedYear, selectedChildId])

  const selectedChild = children.find(c => c.id === selectedChildId)
  const questions = selectedChild
    ? filterQuestionsForAge(MONTHLY_QUESTIONS[selectedMonth] || [], selectedChild.birthdate, selectedYear, selectedMonth)
    : []

  const filledCount = questions.filter(q => {
    const ans = getAnswer(selectedChildId, 'monthly', selectedYear, selectedMonth, q.id)
    return ans && ans.trim()
  }).length

  const years = []
  for (let y = currentYear; y >= currentYear - 5; y--) years.push(y)

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      {/* Header met dropdowns */}
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-4 sticky top-0 z-40">
        <p className="text-text-muted text-sm mb-1">Maandelijkse vragen</p>

        {/* Maand + Jaar dropdowns */}
        <div className="flex gap-2 mb-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="flex-1 bg-background border border-border-light rounded-xl px-3 py-2 text-sm font-semibold text-text-dark focus:outline-none focus:border-primary appearance-none"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
            className="w-24 bg-background border border-border-light rounded-xl px-3 py-2 text-sm font-semibold text-text-dark focus:outline-none focus:border-primary appearance-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Kind-tabs */}
        {children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  child.id === selectedChildId
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-border-light text-text-muted bg-white'
                }`}
                style={child.id === selectedChildId ? { backgroundColor: child.color } : {}}
              >
                <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                  {child.name.charAt(0)}
                </span>
                {child.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voortgangsbalk */}
      {questions.length > 0 && (
        <div className="h-1 bg-border-light">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.round((filledCount / questions.length) * 100)}%`,
              backgroundColor: selectedChild?.color || '#E07845'
            }}
          />
        </div>
      )}

      {/* Vragen */}
      <div className="px-5 py-4">
        {selectedChild && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChildAvatar child={selectedChild} size="md" />
              <div>
                <p className="font-semibold text-text-dark">{selectedChild.name}</p>
                <p className="text-xs text-text-muted">{questions.length} vragen · {filledCount} ingevuld</p>
              </div>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🌱</p>
            <p className="font-semibold text-text-dark mb-1">Geen vragen voor deze maand</p>
            <p className="text-sm text-text-muted">
              {selectedChild ? `Voor ${selectedChild.name} zijn er in ${selectedMonth} geen vragen die bij de leeftijd passen.` : ''}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <QuestionCard
                key={`${selectedChildId}-${selectedMonth}-${selectedYear}-${q.id}`}
                question={q}
                childId={selectedChildId}
                month={selectedMonth}
                year={selectedYear}
                isOpen={openQuestion === q.id}
                onToggle={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
              />
            ))}
          </div>
        )}

        {filledCount === questions.length && questions.length > 0 && (
          <div className="mt-6 bg-green/10 border border-green/30 rounded-3xl p-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-text-dark mb-1">Alle vragen ingevuld!</p>
            <p className="text-sm text-text-muted">
              {selectedMonth} {selectedYear} is compleet voor {selectedChild?.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
