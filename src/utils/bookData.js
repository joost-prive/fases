import { getData, getChildren, getMeasurements } from './storage'
import { filterQuestionsForAge, filterBirthdayQuestions, getAgeAtDate, getAgeInMonth } from './ageUtils'
import { MONTHS, MONTHLY_QUESTIONS, BIRTHDAY_QUESTIONS, MILESTONES } from '../data/questions'

/**
 * Assembles all app data into a "Samen"-style book structure:
 * per month → per question → all years × all children combined.
 * Mirrors the logic of TogetherQuestionHistory in History.jsx.
 *
 * Returns null if there is no content to put in a book.
 */
export function buildBookData() {
  const data = getData()
  const children = getChildren()
  if (!children.length) return null

  // Collect all years that appear across all children
  const allYears = new Set()
  children.forEach(child => {
    Object.keys(data.answers[child.id]?.monthly || {}).forEach(y => allYears.add(Number(y)))
    Object.keys(data.answers[child.id]?.birthday || {}).forEach(y => allYears.add(Number(y)))
  })

  const sortedYears = [...allYears].sort((a, b) => b - a) // newest first, like Samen view
  if (!sortedYears.length) return null

  const yearRange = {
    first: sortedYears[sortedYears.length - 1],
    last: sortedYears[0],
  }

  // --- Monthly sections ---
  // Structure: per month → per question → per year → per child with answer
  const months = MONTHS.map(month => {
    const allQs = MONTHLY_QUESTIONS[month] || []

    const questions = allQs
      .map(q => {
        const entries = sortedYears
          .map(year => {
            const childAnswers = children
              .map(child => {
                const age = getAgeInMonth(child.birthdate, year, month)
                if (age < q.ageMin || age > q.ageMax) return null

                const answer = data.answers[child.id]?.monthly?.[year]?.[month]?.[q.id] || ''
                if (!answer.trim()) return null

                const photo = data.answers[child.id]?.photos?.questions?.[year]?.[month]?.[q.id] || null

                return { child, answer, photo, ageLabel: `${age} jaar` }
              })
              .filter(Boolean)

            return childAnswers.length > 0 ? { year, childAnswers } : null
          })
          .filter(Boolean)

        return entries.length > 0 ? { id: q.id, questionText: q.question, entries } : null
      })
      .filter(Boolean)

    return questions.length > 0 ? { month, questions } : null
  }).filter(Boolean)

  // --- Birthday sections ---
  // Per year (newest first) → per question → per child with answer
  const birthday = sortedYears
    .map(year => {
      const yearQuestions = BIRTHDAY_QUESTIONS
        .map(q => {
          const childAnswers = children
            .map(child => {
              const age = getAgeAtDate(child.birthdate, new Date(Number(year), 11, 31))
              if (age < q.ageMin || age > q.ageMax) return null

              const answer = data.answers[child.id]?.birthday?.[year]?.[q.id] || ''
              if (!answer.trim()) return null

              return { child, answer, ageLabel: `${age} jaar` }
            })
            .filter(Boolean)

          return childAnswers.length > 0 ? { id: q.id, questionText: q.question, childAnswers } : null
        })
        .filter(Boolean)

      return yearQuestions.length > 0 ? { year, questions: yearQuestions } : null
    })
    .filter(Boolean)

  // --- Milestones per child ---
  const milestones = children
    .map(child => {
      const entries = MILESTONES
        .map(m => {
          const answer = data.answers[child.id]?.milestones?.[m.id] || ''
          return answer.trim() ? { id: m.id, questionText: m.question, answer } : null
        })
        .filter(Boolean)
      return entries.length > 0 ? { child, entries } : null
    })
    .filter(Boolean)

  // --- Measurements per child ---
  const measurements = children
    .map(child => ({ child, data: getMeasurements(child.id) }))
    .filter(c => c.data.length > 0)

  if (months.length === 0 && birthday.length === 0 && milestones.length === 0) return null

  return { children, yearRange, months, birthday, milestones, measurements }
}
