// Define the type for translations
export type Translation = {
  [key: string]: string | Translation
}

// Define the type for all translations
export type Translations = {
  [locale: string]: Translation
}

// Create a simple empty translations object
export const translations = {
  en: {},
  zh: {},
  ro: {},
}
