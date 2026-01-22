import { en } from './en'
import { ja } from './ja'

export type Language = 'en' | 'ja'
export type TranslationKey = keyof typeof en

export const translations = {
  en,
  ja,
} as const

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[lang][key] as string
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v))
    }
  }
  return text
}
