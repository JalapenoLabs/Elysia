// Copyright © 2025 Algorivm

// Lib
import i18next from 'i18next' // Core library
import { initReactI18next } from 'react-i18next' // React.js bindings
import Backend from 'i18next-http-backend' // Allows us to load translations from vite /public folder
import LanguageDetector from 'i18next-browser-languagedetector' // Detects the user's language from the browser

// Utility
import { userProfile, DEFAULT_PROFILE } from './profile'
import { BulmaFormSettings } from 'bulma-smart-react-forms'

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)

i18n.init({
  ns: [
    'translation'
  ],
  defaultNS: 'translation',
  debug: false,
  lng: userProfile.get().language,
  interpolation: {
    escapeValue: false
  },
  fallbackLng: DEFAULT_PROFILE.language
})

function updateHTML(language: string) {
  document
    .querySelector('html')
    ?.setAttribute('lang', language)
}

i18next.on('languageChanged', (language) => {
  if (language === userProfile.get().language) {
    return
  }
  userProfile.set('language', language)
  updateHTML(language)
  BulmaFormSettings.changeLanguage(language)
})

BulmaFormSettings.translationFunction = i18n.t

updateHTML(userProfile.get().language)
