import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { getChildren, getMonthCompletion } from '../utils/storage'
import { filterQuestionsForAge } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, MONTHS, MONTH_NUMBERS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

export default function QuestionsOverview() {
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const currentYear = new Date().getFullYear()
  const currentMonth = MONTHS[new Date().getMonth()]

  useEffect(() => {
    setChildren(getChildren())
  }, [])

  // Sort months starting from current
  const currentMonthIdx = MONTHS.indexOf(currentMonth)
  const sortedMonths = [
    ...MONTHS.slice(currentMonthIdx),
    ...MONTHS.slice(0, currentMonthIdx)
  ]

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <p className="text-text-muted text-sm mb-0.5">Maandelijks</p>
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          Vragen <Sparkles size={18} className="text-yellow" />
        </h1>
      </div>

      <div className="px-5 py-5 space-y-4">
        {sortedMonths.map(month => {
          const monthIdx = MONTH_NUMBERS[month]
          const year = monthIdx > currentMonthIdx ? currentYear - 1 : currentYear

          const totalAnswered = children.reduce((acc, child) => {
            const qs = filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], child.birthdate, year, month)
            const { filled } = getMonthCompletion(child.id, year, month, qs.length)
            return acc + filled
          }, 0)

          const totalPossible = children.reduce((acc, child) => {
            const qs = filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], child.birthdate, year, month)
            return acc + qs.length
          }, 0)

          const isCurrentMonth = month === currentMonth
          const pct = totalPossible > 0 ? Math.round((totalAnswered / totalPossible) * 100) : 0

          return (
            <div
              key={month}
              className={`bg-white rounded-3xl border p-4 cursor-pointer active:scale-[0.98] transition-all shadow-sm ${
                isCurrentMonth ? 'border-primary' : 'border-border-light'
              }`}
              onClick={() => navigate(`/vragen/${month}?year=${year}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-dark">{month}</h3>
                  {isCurrentMonth && (
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                      Nu
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {totalPossible > 0 && (
                    <span className={`text-xs font-semibold ${pct === 100 ? 'text-green' : 'text-text-muted'}`}>
                      {pct === 100 ? '✓' : `${pct}%`}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </div>

              {children.length > 0 && totalPossible > 0 ? (
                <>
                  <div className="h-1.5 bg-background rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {children.slice(0, 4).map(child => (
                      <ChildAvatar key={child.id} child={child} size="sm" showName />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs text-text-muted">
                  {children.length === 0 ? 'Voeg kinderen toe om vragen te zien' : 'Geen vragen voor deze maand'}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
