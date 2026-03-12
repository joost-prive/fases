import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Gift, Sparkles, Settings } from 'lucide-react'
import { getChildren } from '../utils/storage'
import { getMonthCompletion } from '../utils/storage'
import { getCurrentMonthName, getCurrentYear, getAgeText, isBirthMonth } from '../utils/ageUtils'
import { filterQuestionsForAge, filterBirthdayQuestions } from '../utils/ageUtils'
import { MONTHLY_QUESTIONS, BIRTHDAY_QUESTIONS, MONTHS } from '../data/questions'
import ChildAvatar from '../components/ChildAvatar'

function MonthSelector({ selectedMonth, selectedYear, onChange }) {
  const currentYear = getCurrentYear()
  const years = []
  for (let y = currentYear; y >= currentYear - 5; y--) years.push(y)

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {MONTHS.map(month => (
        <button
          key={month}
          onClick={() => onChange(month, selectedYear)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            month === selectedMonth
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-text-muted border border-border-light'
          }`}
        >
          {month.slice(0, 3)}
        </button>
      ))}
    </div>
  )
}

function ChildCard({ child, month, year }) {
  const navigate = useNavigate()
  const questions = filterQuestionsForAge(MONTHLY_QUESTIONS[month] || [], child.birthdate, year, month)
  const { filled, total } = getMonthCompletion(child.id, year, month, questions.length)
  const birthMonth = isBirthMonth(child.birthdate)
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0

  return (
    <div
      className="bg-white rounded-3xl p-5 border border-border-light shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
      onClick={() => navigate(`/vragen?childId=${child.id}&month=${month}&year=${year}`)}
    >
      <div className="flex items-center gap-4">
        <ChildAvatar child={child} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-text-dark text-lg">{child.name}</h3>
            {birthMonth && <Gift size={16} className="text-yellow flex-shrink-0" />}
          </div>
          <p className="text-text-muted text-sm">{getAgeText(child.birthdate)}</p>
        </div>
        <ChevronRight size={20} className="text-text-muted flex-shrink-0" />
      </div>

      {total > 0 ? (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">{filled} van {total} vragen</span>
            <span className={`text-xs font-semibold ${pct === 100 ? 'text-green' : 'text-primary'}`}>
              {pct === 100 ? '✓ Klaar!' : `${pct}%`}
            </span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: pct === 100 ? '#6EA86A' : child.color || '#E07845'
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-background rounded-xl px-3 py-2">
          <p className="text-xs text-text-muted">Geen vragen voor deze leeftijd deze maand</p>
        </div>
      )}

      {birthMonth && (
        <div className="mt-3 bg-yellow/10 rounded-xl px-3 py-2 flex items-center gap-2">
          <Gift size={14} className="text-yellow" />
          <p className="text-xs font-medium text-text-dark">Verjaardagsvragen beschikbaar!</p>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName())
  const [selectedYear, setSelectedYear] = useState(getCurrentYear())

  useEffect(() => {
    setChildren(getChildren())
  }, [])

  const currentYear = getCurrentYear()
  const years = []
  for (let y = currentYear; y >= currentYear - 5; y--) years.push(y)

  return (
    <div className="min-h-screen bg-background pb-24 page-enter">
      {/* Header */}
      <div className="bg-white border-b border-border-light px-5 pt-12 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-text-muted text-sm mb-0.5">Jouw maandboek</p>
            <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
              Fases <Sparkles size={20} className="text-yellow" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/kinderen')}
              className="flex -space-x-2"
            >
              {children.slice(0, 3).map(child => (
                <ChildAvatar key={child.id} child={child} size="sm" />
              ))}
              {children.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-border-light flex items-center justify-center text-xs font-bold text-text-muted border-2 border-white">
                  +{children.length - 3}
                </div>
              )}
            </button>
            <button onClick={() => navigate('/instellingen')} className="text-text-muted p-1">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Month selector */}
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChange={(m) => setSelectedMonth(m)}
        />

        {/* Year selector */}
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                y === selectedYear
                  ? 'bg-text-dark text-white'
                  : 'text-text-muted'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {children.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">👶</p>
            <p className="font-semibold text-text-dark mb-2">Nog geen kinderen</p>
            <p className="text-text-muted text-sm mb-6">Voeg je eerste kind toe om te beginnen</p>
            <button
              onClick={() => navigate('/kinderen')}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-2xl"
            >
              Kind toevoegen
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-text-dark text-lg">
                {selectedMonth} {selectedYear}
              </h2>
              <span className="text-text-muted text-sm">{children.length} kind{children.length !== 1 ? 'eren' : ''}</span>
            </div>

            <div className="space-y-4">
              {children.map(child => (
                <ChildCard
                  key={child.id}
                  child={child}
                  month={selectedMonth}
                  year={selectedYear}
                />
              ))}
            </div>

            {/* Birthday section */}
            {children.some(c => isBirthMonth(c.birthdate)) && (
              <div className="mt-6">
                <h2 className="font-bold text-text-dark text-lg mb-3 flex items-center gap-2">
                  <Gift size={20} className="text-yellow" /> Verjaardagsvragen
                </h2>
                <div className="space-y-3">
                  {children.filter(c => isBirthMonth(c.birthdate)).map(child => {
                    const bqs = filterBirthdayQuestions(BIRTHDAY_QUESTIONS, child.birthdate, selectedYear)
                    return (
                      <div
                        key={child.id}
                        className="bg-yellow/10 border border-yellow/30 rounded-3xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                        onClick={() => navigate(`/verjaardag?childId=${child.id}&year=${selectedYear}`)}
                      >
                        <div className="flex items-center gap-3">
                          <ChildAvatar child={child} size="md" />
                          <div>
                            <p className="font-semibold text-text-dark">{child.name}</p>
                            <p className="text-sm text-text-muted">{bqs.length} verjaardagsvragen</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-text-muted" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
