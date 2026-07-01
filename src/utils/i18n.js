import enTranslations from '../i18n/en.json'
import bnTranslations from '../i18n/bn.json'

const translations = {
  en: enTranslations,
  bn: bnTranslations,
}

export const getTranslation = (language) => {
  return translations[language] || translations.en
}

export const t = (key, language = 'en') => {
  const lang = translations[language] || translations.en
  return lang[key] || key
}