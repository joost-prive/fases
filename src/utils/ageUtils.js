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
  // month is the Dutch month name string (used as data key)
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

// Format birthdate to display — accepts a locale string
export function formatBirthdate(birthdate, locale = 'nl-NL') {
  if (!birthdate) return ''
  const date = new Date(birthdate)
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

// Get current month name (Dutch key — used for data lookups)
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

// Get age display text — pass i18next t function for translations
export function getAgeText(birthdate, t) {
  const age = getAgeAtDate(birthdate)
  const birth = new Date(birthdate)
  const now = new Date()
  const monthsOld = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

  if (!t) {
    // Fallback Dutch without i18n
    if (monthsOld < 1) return 'pasgeboren'
    if (monthsOld < 12) return `${monthsOld} maand${monthsOld !== 1 ? 'en' : ''}`
    if (age < 2) {
      const extraMonths = monthsOld - age * 12
      return extraMonths > 0 ? `${age} jaar en ${extraMonths} maand${extraMonths !== 1 ? 'en' : ''}` : `${age} jaar`
    }
    return `${age} jaar`
  }

  if (monthsOld < 1) return t('age.newborn')
  if (monthsOld < 12) return t(`age.months_${monthsOld === 1 ? 'one' : 'other'}`, { count: monthsOld })
  if (age < 2) {
    const extraMonths = monthsOld - age * 12
    if (extraMonths > 0) {
      return t(`age.year_months_${extraMonths === 1 ? 'one' : 'other'}`, { age, count: extraMonths })
    }
    return t('age.years', { age })
  }
  return t('age.years', { age })
}

// Get locale string from i18next language
export function getLocaleFromLang(lang) {
  const map = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE' }
  return map[lang] || 'nl-NL'
}
