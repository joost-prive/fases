const STORAGE_KEY = 'fases_data'

const defaultData = {
  children: [],
  answers: {},
  settings: {
    notificationsEnabled: true,
    reminderDay: 1,
    completedOnboarding: false,
  },
}

export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultData }
    return { ...defaultData, ...JSON.parse(raw) }
  } catch {
    return { ...defaultData }
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Children
export function getChildren() {
  return getData().children
}

export function addChild(child) {
  const data = getData()
  const newChild = { ...child, id: crypto.randomUUID() }
  data.children.push(newChild)
  saveData(data)
  return newChild
}

export function updateChild(id, updates) {
  const data = getData()
  data.children = data.children.map(c => c.id === id ? { ...c, ...updates } : c)
  saveData(data)
}

export function removeChild(id) {
  const data = getData()
  data.children = data.children.filter(c => c.id !== id)
  delete data.answers[id]
  saveData(data)
}

// Answers
// path: monthly | birthday | milestones | stats
export function getAnswer(childId, type, year, month, questionId) {
  const data = getData()
  const answers = data.answers[childId]
  if (!answers) return ''
  if (type === 'monthly') {
    return answers.monthly?.[year]?.[month]?.[questionId] || ''
  }
  if (type === 'birthday') {
    return answers.birthday?.[year]?.[questionId] || ''
  }
  if (type === 'milestones') {
    return answers.milestones?.[questionId] || ''
  }
  if (type === 'stats') {
    return answers.stats?.[year]?.[questionId] || ''
  }
  return ''
}

export function saveAnswer(childId, type, year, month, questionId, value) {
  const data = getData()
  if (!data.answers[childId]) data.answers[childId] = {}
  const a = data.answers[childId]

  if (type === 'monthly') {
    if (!a.monthly) a.monthly = {}
    if (!a.monthly[year]) a.monthly[year] = {}
    if (!a.monthly[year][month]) a.monthly[year][month] = {}
    a.monthly[year][month][questionId] = value
  } else if (type === 'birthday') {
    if (!a.birthday) a.birthday = {}
    if (!a.birthday[year]) a.birthday[year] = {}
    a.birthday[year][questionId] = value
  } else if (type === 'milestones') {
    if (!a.milestones) a.milestones = {}
    a.milestones[questionId] = value
  } else if (type === 'stats') {
    if (!a.stats) a.stats = {}
    if (!a.stats[year]) a.stats[year] = {}
    a.stats[year][questionId] = value
  }

  saveData(data)
}

// Get all answers for a child in a specific month across all years
export function getMonthAnswersAllYears(childId, month) {
  const data = getData()
  const monthly = data.answers[childId]?.monthly || {}
  const result = {}
  for (const year of Object.keys(monthly)) {
    result[year] = monthly[year][month] || {}
  }
  return result
}

// Get completion count for a month
export function getMonthCompletion(childId, year, month, totalQuestions) {
  const data = getData()
  const monthAnswers = data.answers[childId]?.monthly?.[year]?.[month] || {}
  const filled = Object.values(monthAnswers).filter(v => v && v.trim()).length
  return { filled, total: totalQuestions }
}

// Settings
export function getSettings() {
  return getData().settings
}

export function saveSettings(settings) {
  const data = getData()
  data.settings = { ...data.settings, ...settings }
  saveData(data)
}

export function isOnboardingComplete() {
  return getData().settings.completedOnboarding
}

export function completeOnboarding() {
  saveSettings({ completedOnboarding: true })
}
