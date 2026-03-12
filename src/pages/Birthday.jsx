import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Gift, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { getChildren, getAnswer, saveAnswer } from '../utils/storage'
import { filterBirthdayQuestions, getAgeAtDate } from '../utils/ageUtils'
import { BIRTHDAY_QUESTIONS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function QuestionCard({ question, childId, year, isOpen, onToggle }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const saved = getAnswer(childId, 'birthday', year, null, question.id)
    setValue(saved)
  }, [childId, year, question.id])

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    saveAnswer(childId, 'birthday', year, null, question.id, val)
  }

  const hasAnswer = value.trim().length > 0

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-yellow shadow-sm' : 'border-border-light'}`}>
      <button
        className="w-full flex items-start gap-3 p-4 text-left"
        onClick={onToggle}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${hasAnswer ? 'bg-green' : 'bg-background border border-border-light'}`}>
          {hasAnswer ? <Check size={13} className="text-white" strokeWidth={3} /> : <span className="text-xs text-text-muted font-medium">{question.id}</span>}
        </div>
        <p className={`flex-1 text-sm font-medium leading-snug ${isOpen ? 'text-text-dark' : 'text-text-dark'}`}>
          {question.question}
        </p>
        {isOpen ? <ChevronUp size={16} className="text-text-muted flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0 mt-0.5" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Schrijf hier je antwoord..."
            rows={4}
            autoFocus
            className="w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-text-dark placeholder-text-muted focus:outline-none focus:border-yellow bg-background resize-none"
          />
        </div>
      )}
    </div>
  )
}

export default function Birthday() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const childId = params.get('childId')
  const year = parseInt(params.get('year') || new Date().getFullYear())

  const [child, setChild] = useState(null)
  const [openQuestion, setOpenQuestion] = useState(null)

  useEffect(() => {
    const all = getChildren()
    const found = all.find(c => c.id === childId)
    setChild(found || all[0])
  }, [childId])

  if (!child) return null

  const age = getAgeAtDate(child.birthdate, new Date(year, 11, 31))
  const questions = filterBirthdayQuestions(BIRTHDAY_QUESTIONS, child.birthdate, year)
  const filled = questions.filter(q => {
    const ans = getAnswer(child.id, 'birthday', year, null, q.id)
    return ans && ans.trim()
  }).length

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-text-muted">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="font-bold text-text-dark text-lg flex items-center gap-2">
              Verjaardag <Gift size={18} className="text-yellow" />
            </h1>
            <p className="text-text-muted text-xs">{child.name} wordt {age} — {year}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center gap-3 mb-5">
          <ChildAvatar child={child} size="lg" />
          <div>
            <p className="font-bold text-text-dark">{child.name}</p>
            <p className="text-sm text-text-muted">{filled} van {questions.length} ingevuld</p>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              childId={child.id}
              year={year}
              isOpen={openQuestion === q.id}
              onToggle={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
