import { useTranslation } from 'react-i18next'
import type { Locale } from '@/types'

/** Maps the active i18n language to one of the API content languages. */
export function useLocale(): Locale {
  const { i18n } = useTranslation()
  return i18n.language.startsWith('vi') ? 'vi' : 'en'
}
