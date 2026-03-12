import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { getChildren, getAnswer, saveAnswer, getMonthAnswersAllYears } from '../utils/storage'
import { filterQuestionsForAge } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function PreviousAnswers({ childId, month, questionId }) {
  const allYears = getMonthAnswersAllYears(childId, month)
  const currentYear = new Date().getFullYear()
  const entries = Object.entries(allYears)
    .filter(([year, answers]) => parseInt(year) < currentYear && answers[questionId])
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
  const textRef = useRef(null)

  useEffect(() => {
    const saved = getAnswer(childId, 'monthly', year, month, question.id)
    setValue(saved)
  }, [childId, month, year, question.id])

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    saveAnswer(childId, 'monthly', year, month, question.id, val)
  }

  const hasAnswer = value.trim().length > 0

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      isOpen ? 'border-primary shadow-sm' : 'border-border-light'
    }`}>
      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={onToggle}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
          hasAnswer ? 'bg-green' : 'bg-background border border-border-light'
        }`}>
          {hasAnswer ? (
            <Check size={13} className="text-white" strokeWidth={3} />
          ) : (
            <span className="text-xs text-text-muted font-medium">{question.id}</span>
          )}
        </div>
        <p className={`flex-1 text-sm leading-snug font-medium ${
          hasAnswer ? 'text-text-dark' : isOpen ? 'text-primary' : 'text-text-dark'
        }`}>
          {question.question}
        </p>
        <div className="text-text-muted flex-shrink-0 mt-0.5">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <textarea
            ref={textRef}
            value={value}
            onChange={handleChange}
            placeholder="Schrijf hier je antwoord..."
            rows={4}
            autoFocus
            className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark placeholder-text-muted focus:outline-none focus:border-primary bg-background resize-none"
          />
          <PreviousAnswers childId={childId} month={month} questionId={question.id} />
        </div>
      )}
    </div>
  )
}

export default function MonthlyQuestions() {
  const [params] = useSearchParams()
  const { month: monthParam } = useParams()
  const navigate = useNavigate()
  const childId = params.get('childId')
  const month = monthParam || params.get('month') || MONTHS[new Date().getMonth()]
  const year = parseInt(params.get('year') || new Date().getFullYear())

  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(childId)
  const [openQuestion, setOpenQuestion] = useState(null)

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (!selectedChildId && all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  const selectedChild = children.find(c => c.id === selectedChildId)
  const questions = selectedChild
    ? filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], selectedChild.birthdate, year, month)
    : []

  // Count filled
  const filledCount = questions.filter(q => {
    const ans = getAnswer(selectedChildId, 'monthly', year, month, q.id)
    return ans && ans.trim()
  }).length

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      {/* Header */}
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-text-muted active:text-text-dark">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-text-dark text-lg leading-none">{month} {year}</h1>
            <p className="text-text-muted text-xs mt-0.5">{filledCount} van {questions.length} ingevuld</p>
          </div>
        </div>

        {/* Child tabs */}
        {children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => { setSelectedChildId(child.id); setOpenQuestion(null) }}
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

      {/* Progress bar */}
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

      {/* Questions */}
      <div className="px-5 py-4">
        {selectedChild && (
          <div className="flex items-center gap-3 mb-5">
            <ChildAvatar child={selectedChild} size="md" />
            <div>
              <p className="font-semibold text-text-dark">{selectedChild.name}</p>
              <p className="text-xs text-text-muted">{questions.length} vragen deze maand</p>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🌱</p>
            <p className="font-semibold text-text-dark mb-1">Geen vragen deze maand</p>
            <p className="text-sm text-text-muted">
              {selectedChild ? `Voor ${selectedChild.name} zijn er in ${month} geen vragen die bij de leeftijd passen.` : ''}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <QuestionCard
                key={`${selectedChildId}-${q.id}`}
                question={q}
                childId={selectedChildId}
                month={month}
                year={year}
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
              Geweldig, je hebt {month} {year} compleet gemaakt voor {selectedChild?.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
