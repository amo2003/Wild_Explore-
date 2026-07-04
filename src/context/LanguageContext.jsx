import { createContext, useContext, useState } from 'react'
import { t, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  // tr(key) – accepts a translation object like t.home.heroTitle1 and returns the string for current lang
  function tr(obj) {
    if (!obj) return ''
    return obj[lang] ?? obj['en'] ?? ''
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr, LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
