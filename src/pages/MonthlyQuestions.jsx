import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Check, Camera, X, Loader2, Mic, MicOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  getChildren, getAnswer, saveAnswer, getMonthAnswersAllYears,
  getQuestionPhotoUrl, saveQuestionPhotoUrl, clearQuestionPhotoUrl,
} from '../utils/storage'
import { uploadQuestionPhoto } from '../utils/photoService'
import { useAuth } from '../contexts/AuthContext'
import { filterQuestionsForAge, getCurrentMonthName, getCurrentYear } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

// ─── Vorige-jaren antwoorden ──────────────────────────────────────────────────
function PreviousAnswers({ childId, month, questionId, currentYear }) {
  const { t } = useTranslation()
  const allYears = getMonthAnswersAllYears(childId, month)
  const entries = Object.entries(allYears)
    .filter(([year, answers]) => parseInt(year) !== currentYear && answers[questionId])
    .sort(([a], [b]) => b - a)
  if (entries.length === 0) return null
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{t('questions.prev_years')}</p>
      {entries.map(([year, answers]) => (
        <div key={year} className="bg-teal/5 border border-teal/20 rounded-xl px-3 py-2.5">
          <p className="text-xs font-semibold text-teal mb-1">{year}</p>
          <p className="text-sm text-text-dark leading-relaxed">{answers[questionId]}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Compact foto-rij per vraag ───────────────────────────────────────────────
function QuestionPhotoRow({ childId, year, month, questionId }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const inputRef = useRef(null)
  const [url, setUrl] = useState(() => getQuestionPhotoUrl(childId, year, month, questionId))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setUrl(getQuestionPhotoUrl(childId, year, month, questionId))
    setError('')
  }, [childId, year, month, questionId])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 15 * 1024 * 1024) { setError(t('questions.max_size')); return }
    setLoading(true)
    setError('')
    try {
      const downloadUrl = await uploadQuestionPhoto(user.uid, childId, year, month, questionId, file)
      saveQuestionPhotoUrl(childId, year, month, questionId, downloadUrl)
      setUrl(downloadUrl)
    } catch (err) {
      setError(t('questions.upload_failed'))
      console.error(err)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const handleDelete = () => {
    clearQuestionPhotoUrl(childId, year, month, questionId)
    setUrl(null)
  }

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {url ? (
        <div className="relative inline-block">
          <img
            src={url}
            alt="Foto bij vraag"
            className="h-28 w-auto rounded-xl object-cover"
          />
          {loading && (
            <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
              <Loader2 size={18} className="text-white animate-spin" />
            </div>
          )}
          {!loading && (
            <>
              <button
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-black/55 flex items-center justify-center"
              >
                <Camera size={12} className="text-white" />
              </button>
              <button
                onClick={handleDelete}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/55 flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors disabled:opacity-50"
        >
          {loading
            ? <Loader2 size={13} className="animate-spin" />
            : <Camera size={13} />}
          <span>{t('questions.add_photo')}</span>
        </button>
      )}

      {error && <p className="mt-1 text-xs text-rose">{error}</p>}
    </div>
  )
}

// ─── Vraagkaart ───────────────────────────────────────────────────────────────
const isSpeechSupported = typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition)

function QuestionCard({ question, childId, month, year, isOpen, onToggle }) {
  const { t, i18n } = useTranslation()
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    setValue(getAnswer(childId, 'monthly', year, month, question.id))
  }, [childId, month, year, question.id])

  useEffect(() => {
    if (!isOpen) {
      recognitionRef.current?.abort()
      setListening(false)
      setInterimText('')
    }
  }, [isOpen])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  const handleChange = (e) => {
    setValue(e.target.value)
    saveAnswer(childId, 'monthly', year, month, question.id, e.target.value)
  }

  const appendText = (text) => {
    setValue(prev => {
      const spacer = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : ''
      const newVal = prev + spacer + text.trim()
      saveAnswer(childId, 'monthly', year, month, question.id, newVal)
      return newVal
    })
  }

  // Speech language follows app language
  const speechLang = { nl: 'nl-NL', en: 'en-US', de: 'de-DE' }[i18n.language] || 'nl-NL'

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = speechLang
    r.continuous = true
    r.interimResults = true

    r.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          appendText(text)
          setInterimText('')
        } else {
          interim += text
        }
      }
      setInterimText(interim)
    }
    r.onend  = () => { setListening(false); setInterimText('') }
    r.onerror = (e) => {
      if (e.error !== 'no-speech') console.warn('Spraakherkenning:', e.error)
      setListening(false); setInterimText('')
    }

    recognitionRef.current = r
    r.start()
    setListening(true)
  }

  const stopListening = () => recognitionRef.current?.stop()

  const hasAnswer = value.trim().length > 0
  const hasPhoto  = !!getQuestionPhotoUrl(childId, year, month, question.id)

  // Question text: translated if available, else fallback to Dutch
  const questionText = t(`monthly.${month}.${question.id}`, { defaultValue: question.question })

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-primary shadow-sm' : 'border-border-light'}`}>
      <button className="w-full flex items-start gap-3 p-4 text-left" onClick={onToggle}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${hasAnswer ? 'bg-green' : 'bg-background border border-border-light'}`}>
          {hasAnswer
            ? <Check size={13} className="text-white" strokeWidth={3} />
            : <span className="text-xs text-text-muted font-medium">{question.id}</span>}
        </div>
        <p className={`flex-1 text-sm leading-snug font-medium ${isOpen ? 'text-primary' : 'text-text-dark'}`}>
          {questionText}
        </p>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          {hasPhoto && !isOpen && <Camera size={13} className="text-text-muted" />}
          {isOpen ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="relative">
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={listening ? t('questions.listening_placeholder') : t('questions.answer_placeholder')}
              rows={4}
              autoFocus={!listening}
              className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm text-text-dark placeholder-text-muted focus:outline-none bg-background resize-none transition-colors ${
                listening ? 'border-rose/40' : 'border-border-light focus:border-primary'
              }`}
            />
            {isSpeechSupported && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  listening ? 'text-rose animate-pulse' : 'text-text-muted hover:text-primary'
                }`}
                title={listening ? t('questions.mic_stop') : t('questions.mic_start')}
              >
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            )}
          </div>

          {interimText && (
            <p className="mt-1 text-xs text-text-muted italic px-1">{interimText}…</p>
          )}

          <QuestionPhotoRow childId={childId} year={year} month={month} questionId={question.id} />
          <PreviousAnswers childId={childId} month={month} questionId={question.id} currentYear={year} />
        </div>
      )}
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function MonthlyQuestions() {
  const { t } = useTranslation()
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
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-4 sticky top-0 z-40">
        <p className="text-text-muted text-sm mb-1">{t('questions.subtitle')}</p>

        <div className="flex gap-2 mb-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="flex-1 bg-background border border-border-light rounded-xl px-3 py-2 text-sm font-semibold text-text-dark focus:outline-none focus:border-primary appearance-none"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{t(`months.${m}`)}</option>
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

      <div className="px-5 py-4">
        {selectedChild && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChildAvatar child={selectedChild} size="md" />
              <div>
                <p className="font-semibold text-text-dark">{selectedChild.name}</p>
                <p className="text-xs text-text-muted">
                  {t('questions.count', { total: questions.length, filled: filledCount })}
                </p>
              </div>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🌱</p>
            <p className="font-semibold text-text-dark mb-1">{t('questions.none_title')}</p>
            <p className="text-sm text-text-muted">
              {selectedChild ? t('questions.none_desc', { name: selectedChild.name, month: t(`months.${selectedMonth}`) }) : ''}
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
            <p className="font-bold text-text-dark mb-1">{t('questions.all_done_title')}</p>
            <p className="text-sm text-text-muted">
              {t('questions.all_done_desc', {
                month: t(`months.${selectedMonth}`),
                year: selectedYear,
                name: selectedChild?.name
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
