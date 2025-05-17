"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define available languages
export type Language = "en" | "de" | "fr" | "ru" | "zh" | "ro" | "it" | "es"

// Language store interface
export interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
}

// Create the language store with persistence
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    },
  ),
)

// Language display names
export const languageNames: Record<Language, string> = {
  en: "English",
  ro: "Română",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  zh: "中文",
  it: "Italiano",
  es: "Español",
}

// Translation function
export function useTranslation() {
  return {
    t: (key: string) => key, // Simple passthrough function
  }
}
