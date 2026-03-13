import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, ChevronRight, AlertCircle, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getChildren, getMonthCompletion } from '../utils/storage'
import { getCurrentMonthName, getCurrentYear, isBirthMonth } from '../utils/ageUtils'
import { filterQuestionsForAge } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'
import AppLogo from '../components/AppLogo'

function ChildProgress({ child, month, year }) {
  const { t } = useTranslation()
  const questions = filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], child.birthdate, year, month)
  const { filled, total } = getMonthCompletion(child.id, year, month, questions.length)
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <ChildAvatar child={child} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-text-dark">{child.name}</span>
          <span className={`text-xs font-semibold ${pct === 100 ? 'text-green' : 'text-text-muted'}`}>
            {pct === 100 ? t('home.done_check') : `${filled}/${total}`}
          </span>
        </div>
        <div className="h-1.5 bg-background rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#6EA86A' : child.color }}
          />
        </div>
      </div>
    </div>
  )
}

function getMissedMonths(children, currentMonth, currentYear) {
  const currentIdx = MONTHS.indexOf(currentMonth)
  const missed = []
  for (let i = 1; i <= 3; i++) {
    let idx = currentIdx - i
    let year = currentYear
    if (idx < 0) { idx += 12; year -= 1 }
    const month = MONTHS[idx]
    const hasUnanswered = children.some(child => {
      const questions = filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], child.birthdate, year, month)
      if (questions.length === 0) return false
      const { filled, total } = getMonthCompletion(child.id, year, month, questions.length)
      return filled < total
    })
    if (hasUnanswered) missed.push({ month, year })
  }
  return missed
}

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const currentMonth = getCurrentMonthName()
  const currentYear = getCurrentYear()

  useEffect(() => { setChildren(getChildren()) }, [])

  const missedMonths = getMissedMonths(children, currentMonth, currentYear)
  const hasBirthday = children.some(c => isBirthMonth(c.birthdate))

  const totalFilled = children.reduce((acc, child) => {
    const qs = filterQuestionsForAge(MONTHLY_QUESTIONS[currentMonth] || [], child.birthdate, currentYear, currentMonth)
    const { filled } = getMonthCompletion(child.id, currentYear, currentMonth, qs.length)
    return acc + filled
  }, 0)
  const totalPossible = children.reduce((acc, child) => {
    const qs = filterQuestionsForAge(MONTHLY_QUESTIONS[currentMonth] || [], child.birthdate, currentYear, currentMonth)
    return acc + qs.length
  }, 0)
  const allDone = totalPossible > 0 && totalFilled === totalPossible

  const currentMonthDisplay = t(`months.${currentMonth}`)

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo size={34} />
            <div>
              <p className="text-text-muted text-xs mb-0">{t('home.subtitle')}</p>
              <h1 className="text-xl font-bold text-text-dark leading-tight">Fases</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {children.length > 0 && (
              <button onClick={() => navigate('/kinderen')} className="flex -space-x-2">
                {children.slice(0, 3).map(child => (
                  <ChildAvatar key={child.id} child={child} size="sm" />
                ))}
              </button>
            )}
            <button onClick={() => navigate('/instellingen')} className="text-text-muted p-1 ml-1">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">
        {children.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <AppLogo size={56} className="mb-4" />
            <p className="font-bold text-text-dark text-lg mb-2">{t('home.welcome_title')}</p>
            <p className="text-text-muted text-sm mb-6 leading-relaxed max-w-xs mx-auto">
              {t('home.welcome_desc')}
            </p>
            <button
              onClick={() => navigate('/kinderen')}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-2xl shadow-md"
            >
              {t('home.add_first_child')}
            </button>
          </div>
        ) : (
          <>
            {/* Vragen invullen */}
            <div
              className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/vragen?month=${currentMonth}&year=${currentYear}`)}
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-text-dark text-base">{t('home.questions_title')}</h2>
                      <ChevronRight size={18} className="text-text-muted" />
                    </div>
                    <p className="text-text-muted text-sm mt-0.5">
                      {allDone
                        ? t('home.questions_done', { month: currentMonthDisplay })
                        : t('home.questions_ready', { month: currentMonthDisplay })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {children.map(child => (
                    <ChildProgress key={child.id} child={child} month={currentMonth} year={currentYear} />
                  ))}
                </div>
              </div>
              {allDone && (
                <div className="bg-green/10 border-t border-green/20 px-5 py-2.5">
                  <p className="text-xs font-medium text-green">{t('home.all_done', { month: currentMonthDisplay })}</p>
                </div>
              )}
            </div>

            {/* Verjaardag banner */}
            {hasBirthday && (
              <div
                className="bg-yellow/10 border border-yellow/30 rounded-3xl px-5 py-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/verjaardag?childId=${children.find(c => isBirthMonth(c.birthdate))?.id}&year=${currentYear}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎂</span>
                  <div>
                    <p className="font-bold text-text-dark text-sm">{t('home.birthday_title')}</p>
                    <p className="text-xs text-text-muted">
                      {t('home.birthday_desc', { names: children.filter(c => isBirthMonth(c.birthdate)).map(c => c.name).join(' & ') })}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            )}

            {/* Tijdreis */}
            <div
              className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate('/tijdreis')}
            >
              <div className="px-5 py-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={22} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-text-dark text-base">{t('home.history_title')}</h2>
                    <ChevronRight size={18} className="text-text-muted" />
                  </div>
                  <p className="text-text-muted text-sm mt-0.5 leading-snug">
                    {children.length > 1
                      ? t('home.history_desc_many')
                      : t('home.history_desc_one', { name: children[0]?.name })}
                  </p>
                </div>
              </div>
            </div>

            {/* Gemiste maanden */}
            {missedMonths.length > 0 && (
              <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow flex-shrink-0" />
                  <p className="text-sm font-semibold text-text-dark">{t('home.missed_months')}</p>
                </div>
                {missedMonths.map(({ month, year }) => (
                  <button
                    key={`${month}-${year}`}
                    className="w-full flex items-center justify-between px-5 py-3 border-t border-border-light text-left active:bg-background"
                    onClick={() => navigate(`/vragen?month=${month}&year=${year}`)}
                  >
                    <span className="text-sm text-text-dark font-medium">{t(`months.${month}`)} {year}</span>
                    <ChevronRight size={16} className="text-text-muted" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
