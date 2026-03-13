import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import nl from './locales/nl.json'
import en from './locales/en.json'
import de from './locales/de.json'

const LANG_KEY = 'fases_language'

const savedLang = localStorage.getItem(LANG_KEY) || 'nl'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nl },
      en: { translation: en },
      de: { translation: de },
    },
    lng: savedLang,
    fallbackLng: 'nl',
    interpolation: { escapeValue: false },
  })

export function setLanguage(lang) {
  i18n.changeLanguage(lang)
  localStorage.setItem(LANG_KEY, lang)
}

export { LANG_KEY }
export default i18n
