import { MONTHS } from '../data/questions'

// Calculate age in years at a given date
export function getAgeAtDate(birthdate, atDate = new Date()) {
  const birth = new Date(birthdate)
  let age = atDate.getFullYear() - birth.getFullYear()
  const monthDiff = atDate.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && atDate.getDate() < birth.getDate())) {
    age--
  }
  return Math.max(0, age)
}

// Get age at start of a given month/year
export function getAgeInMonth(birthdate, year, month) {
  // month is the month name string
  const monthIndex = MONTHS.indexOf(month)
  const atDate = new Date(parseInt(year), monthIndex, 1)
  return getAgeAtDate(birthdate, atDate)
}

// Filter questions to only those relevant for a child's age
export function filterQuestionsForAge(questions, birthdate, year, month) {
  const age = getAgeInMonth(birthdate, year, month)
  return questions.filter(q => age >= q.ageMin && age <= q.ageMax)
}

// Filter birthday questions
export function filterBirthdayQuestions(questions, birthdate, year) {
  const age = getAgeAtDate(birthdate, new Date(parseInt(year), 11, 31))
  return questions.filter(q => age >= q.ageMin && age <= q.ageMax)
}

// Format birthdate to display
export function formatBirthdate(birthdate) {
  if (!birthdate) return ''
  const date = new Date(birthdate)
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Get current month name
export function getCurrentMonthName() {
  return MONTHS[new Date().getMonth()]
}

// Get current year
export function getCurrentYear() {
  return new Date().getFullYear()
}

// Get birth month (0-indexed)
export function getBirthMonth(birthdate) {
  return new Date(birthdate).getMonth()
}

// Check if current month is birth month
export function isBirthMonth(birthdate) {
  return new Date().getMonth() === getBirthMonth(birthdate)
}

// Get age display text
export function getAgeText(birthdate) {
  const age = getAgeAtDate(birthdate)
  const birth = new Date(birthdate)
  const now = new Date()
  const monthsOld = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

  if (monthsOld < 1) return 'pasgeboren'
  if (monthsOld < 12) return `${monthsOld} maand${monthsOld !== 1 ? 'en' : ''}`
  if (age < 2) {
    const extraMonths = monthsOld - age * 12
    return extraMonths > 0 ? `${age} jaar en ${extraMonths} maand${extraMonths !== 1 ? 'en' : ''}` : `${age} jaar`
  }
  return `${age} jaar`
}
