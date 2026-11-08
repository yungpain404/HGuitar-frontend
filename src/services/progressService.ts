import api from '@/lib/api'
import type { Locale, UserProgress } from '@/types'

export const progressService = {
  async getUserProgress(lang: Locale = 'en'): Promise<UserProgress> {
    const { data } = await api.get<UserProgress>('/users/me/progress', { params: { lang } })
    return data
  },
}
