import { useState, useEffect } from 'react'
import { Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getChildren, getData } from '../utils/storage'
import { getAgeInMonth, getLocaleFromLang } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS, BIRTHDAY_QUESTIONS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

// Single child: one question across all years
function QuestionHistory({ question, allYearAnswers, child, questionText }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const entries = Object.entries(allYearAnswers)
    .filter(([, answers]) => answers[question.id])
    .sort(([a], [b]) => b - a)
  if (entries.length === 0) return null

  const yearsCount = entries.length
  const yearsKey = yearsCount === 1 ? 'history.years_filled_one' : 'history.years_filled_other'

  return (
    <div className="border-b border-border-light last:border-0">
      <button className="w-full flex items-start gap-3 py-3 px-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <p className="text-sm font-medium text-text-dark leading-snug">{questionText}</p>
          <p className="text-xs text-text-muted mt-0.5">{t(yearsKey, { count: yearsCount })}</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-muted flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0 mt-1" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {entries.map(([year, answers]) => {
            const age = getAgeInMonth(child.birthdate, year, 'Januari')
            return (
              <div key={year} className="bg-background rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-primary">{year}</span>
                  <span className="text-xs text-text-muted">· {t('history.age', { age })}</span>
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

// "Samen": one question, all children side by side per year
function TogetherQuestionHistory({ question, children, allData, questionText }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const yearsSet = new Set()
  children.forEach(child => {
    const monthly = allData.answers[child.id]?.monthly || {}
    MONTHS.forEach(month => {
      Object.keys(monthly).forEach(year => {
        if (monthly[year]?.[month]?.[question.id]) yearsSet.add(year)
      })
    })
  })
  const years = [...yearsSet].sort((a, b) => b - a)
  if (years.length === 0) return null

  const monthYearEntries = []
  MONTHS.forEach(month => {
    years.forEach(year => {
      const hasAny = children.some(child => {
        return allData.answers[child.id]?.monthly?.[year]?.[month]?.[question.id]
      })
      if (hasAny) monthYearEntries.push({ month, year })
    })
  })

  if (monthYearEntries.length === 0) return null

  const momentsCount = monthYearEntries.length
  const momentsKey = momentsCount === 1 ? 'history.moments_filled_one' : 'history.moments_filled_other'

  return (
    <div className="border-b border-border-light last:border-0">
      <button className="w-full flex items-start gap-3 py-3 px-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <p className="text-sm font-medium text-text-dark leading-snug">{questionText}</p>
          <p className="text-xs text-text-muted mt-0.5">{t(momentsKey, { count: momentsCount })}</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-muted flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0 mt-1" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {monthYearEntries.map(({ month, year }) => (
            <div key={`${month}-${year}`}>
              <p className="text-xs font-bold text-primary mb-2">{t(`months.${month}`)} {year}</p>
              <div className="space-y-2">
                {children.map(child => {
                  const answer = allData.answers[child.id]?.monthly?.[year]?.[month]?.[question.id]
                  if (!answer) return null
                  const age = getAgeInMonth(child.birthdate, year, month)
                  return (
                    <div key={child.id} className="bg-background rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: child.color }}>
                          {child.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-text-dark">{child.name}</span>
                        <span className="text-xs text-text-muted">· {t('history.age', { age })}</span>
                      </div>
                      <p className="text-sm text-text-dark leading-relaxed">{answer}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MonthSection({ month, childId, child }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const data = getData()
  const monthly = data.answers[childId]?.monthly || {}
  const allYearAnswers = {}
  Object.keys(monthly).forEach(year => { allYearAnswers[year] = monthly[year][month] || {} })

  const hasAny = Object.values(allYearAnswers).some(a => Object.values(a).some(v => v))
  if (!hasAny) return null

  const yearsCount = Object.entries(allYearAnswers).filter(([, a]) => Object.values(a).some(v => v)).length
  const yearsKey = yearsCount === 1 ? 'history.years_filled_one' : 'history.years_filled_other'

  return (
    <div className="bg-white/90 rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="font-bold text-text-dark">{t(`months.${month}`)}</h3>
          <p className="text-xs text-text-muted">{t(yearsKey, { count: yearsCount })}</p>
        </div>
        {expanded ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
      </button>
      {expanded && (
        <div>
          {(MONTHLY_QUESTIONS[month] || []).map(q => (
            <QuestionHistory
              key={q.id}
              question={q}
              allYearAnswers={allYearAnswers}
              child={child}
              questionText={t(`monthly.${month}.${q.id}`, { defaultValue: q.question })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TogetherMonthSection({ month, children, allData }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const hasAny = children.some(child => {
    const monthly = allData.answers[child.id]?.monthly || {}
    return Object.values(monthly).some(yearData => {
      const monthData = yearData[month] || {}
      return Object.values(monthData).some(v => v)
    })
  })
  if (!hasAny) return null

  return (
    <div className="bg-white/90 rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-text-dark">{t(`months.${month}`)}</h3>
          <div className="flex -space-x-1">
            {children.map(c => (
              <div key={c.id} className="w-4 h-4 rounded-full border border-white flex-shrink-0" style={{ backgroundColor: c.color }} />
            ))}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
      </button>
      {expanded && (
        <div>
          {(MONTHLY_QUESTIONS[month] || []).map(q => (
            <TogetherQuestionHistory
              key={q.id}
              question={q}
              children={children}
              allData={allData}
              questionText={t(`monthly.${month}.${q.id}`, { defaultValue: q.question })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const { t, i18n } = useTranslation()
  const locale = getLocaleFromLang(i18n.language)
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)

  useEffect(() => {
    const all = getChildren()
    setChildren(all)
    if (all.length > 0) setSelectedChildId(all[0].id)
  }, [])

  const selectedChild = children.find(c => c.id === selectedChildId)
  const showTogether = selectedChildId === 'samen'
  const allData = getData()

  return (
    <div className="min-h-screen pb-24 page-enter">
      <div className="bg-white/90 backdrop-blur-md border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">{t('history.subtitle')}</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          {t('history.title')} <Clock size={20} className="text-teal" />
        </h1>

        {children.length > 0 && (
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
            {children.length > 1 && (
              <button
                onClick={() => setSelectedChildId('samen')}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  selectedChildId === 'samen'
                    ? 'bg-text-dark text-white border-transparent'
                    : 'border-border-light text-text-muted bg-white'
                }`}
              >
                {t('history.together')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-5">
        {children.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⏳</p>
            <p className="font-semibold text-text-dark">{t('history.none')}</p>
          </div>
        ) : showTogether ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              {children.map(c => <ChildAvatar key={c.id} child={c} size="md" showName />)}
            </div>
            <div className="space-y-3">
              {MONTHS.map(month => (
                <TogetherMonthSection key={month} month={month} children={children} allData={allData} />
              ))}
            </div>
          </>
        ) : (
          selectedChild && (
            <>
              <div className="flex items-center gap-3 mb-5 bg-white rounded-2xl p-4 border border-border-light">
                <ChildAvatar child={selectedChild} size="lg" />
                <div>
                  <p className="font-bold text-text-dark text-lg">{selectedChild.name}</p>
                  <p className="text-sm text-text-muted">
                    {t('history.born', {
                      date: new Date(selectedChild.birthdate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {MONTHS.map(month => (
                  <MonthSection key={month} month={month} childId={selectedChildId} child={selectedChild} />
                ))}
              </div>

              {(() => {
                const birthdayAnswers = allData.answers[selectedChildId]?.birthday || {}
                const hasAny = Object.values(birthdayAnswers).some(y => Object.values(y).some(v => v))
                if (!hasAny) return null
                return (
                  <div className="mt-6">
                    <h2 className="font-bold text-text-dark mb-3">{t('history.birthdays')}</h2>
                    <div className="bg-white rounded-2xl border border-yellow/30 overflow-hidden shadow-sm">
                      {BIRTHDAY_QUESTIONS.map(q => (
                        <QuestionHistory
                          key={q.id}
                          question={q}
                          allYearAnswers={birthdayAnswers}
                          child={selectedChild}
                          questionText={t(`birthday_q.${q.id}`, { defaultValue: q.question })}
                        />
                      ))}
                    </div>
                  </div>
                )
              })()}
            </>
          )
        )}
      </div>
    </div>
  )
}
