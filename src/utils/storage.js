import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const LOCAL_KEY = 'fases_data'

const defaultData = {
  children: [],
  answers: {},
  settings: {
    notificationsEnabled: true,
    reminderDay: 1,
    completedOnboarding: false,
  },
}

// In-memory cache — sneller dan localStorage, gesynchroniseerd met Firestore
let cache = null
let currentUserId = null

// Laad data van Firestore bij inloggen. Migreert localStorage-data als eerste login.
export async function initUserData(userId) {
  currentUserId = userId
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    if (snap.exists()) {
      cache = { ...defaultData, ...snap.data() }
    } else {
      // Eerste keer inloggen: bestaande localStorage-data overnemen
      const local = localStorage.getItem(LOCAL_KEY)
      cache = local ? { ...defaultData, ...JSON.parse(local) } : { ...defaultData }
      await setDoc(doc(db, 'users', userId), cache)
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cache))
  } catch (e) {
    console.warn('Firestore laden mislukt, gebruik localStorage', e)
    const local = localStorage.getItem(LOCAL_KEY)
    cache = local ? { ...defaultData, ...JSON.parse(local) } : { ...defaultData }
  }
}

// Reset bij uitloggen — ook localStorage leegmaken zodat een volgend account niet dezelfde data ziet
export function clearUserData() {
  cache = null
  currentUserId = null
  localStorage.removeItem(LOCAL_KEY)
}

// Interne helper: sla op in cache + localStorage + Firestore (async, fire-and-forget)
function persist(data) {
  cache = data
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  if (currentUserId) {
    setDoc(doc(db, 'users', currentUserId), data).catch(e =>
      console.warn('Firestore sync mislukt', e)
    )
  }
}

export function getData() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { ...defaultData }
    return { ...defaultData, ...JSON.parse(raw) }
  } catch {
    return { ...defaultData }
  }
}

export function saveData(data) {
  persist(data)
}

// Children
export function getChildren() {
  return getData().children
}

export function addChild(child) {
  const data = getData()
  const newChild = { ...child, id: crypto.randomUUID() }
  data.children.push(newChild)
  persist(data)
  return newChild
}

export function updateChild(id, updates) {
  const data = getData()
  data.children = data.children.map(c => c.id === id ? { ...c, ...updates } : c)
  persist(data)
}

export function removeChild(id) {
  const data = getData()
  data.children = data.children.filter(c => c.id !== id)
  delete data.answers[id]
  persist(data)
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

  persist(data)
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

// ─── Groeimetingen (datum + lengte + gewicht) ─────────────────────────────────
// Opgeslagen als data.answers[childId].measurements = [{ id, date, height, weight }]

export function getMeasurements(childId) {
  const data = getData()
  const measurements = data.answers[childId]?.measurements || []
  return [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function addMeasurement(childId, { date, height, weight }) {
  const data = getData()
  if (!data.answers[childId]) data.answers[childId] = {}
  if (!data.answers[childId].measurements) data.answers[childId].measurements = []
  const newM = { id: crypto.randomUUID(), date, height, weight }
  data.answers[childId].measurements.push(newM)
  persist(data)
  return newM
}

export function updateMeasurement(childId, id, updates) {
  const data = getData()
  if (!data.answers[childId]?.measurements) return
  data.answers[childId].measurements = data.answers[childId].measurements.map(m =>
    m.id === id ? { ...m, ...updates } : m
  )
  persist(data)
}

export function removeMeasurement(childId, id) {
  const data = getData()
  if (!data.answers[childId]?.measurements) return
  data.answers[childId].measurements = data.answers[childId].measurements.filter(m => m.id !== id)
  persist(data)
}

// Settings
export function getSettings() {
  return getData().settings
}

export function saveSettings(settings) {
  const data = getData()
  data.settings = { ...data.settings, ...settings }
  persist(data)
}

export function isOnboardingComplete() {
  return getData().settings.completedOnboarding
}

export function completeOnboarding() {
  saveSettings({ completedOnboarding: true })
}
