import api from '@/lib/api'
import type { LearningMethod, GuitarDifficulty } from '@/types'

export const learningMethodService = {
  /**
   * Lấy danh sách phương pháp học phổ biến.
   */
  async getLearningMethods(params?: {
    difficulty?: GuitarDifficulty
    lang?: 'vi' | 'en'
  }): Promise<LearningMethod[]> {
    const query: Record<string, string> = {}
    if (params?.difficulty) query.difficulty = params.difficulty
    if (params?.lang) query.lang = params.lang
    const { data } = await api.get<LearningMethod[]>('/learning-methods', {
      params: query,
    })
    return data
  },

  /**
   * Lấy chi tiết 1 phương pháp học kèm các bước (steps).
   */
  async getLearningMethod(id: string, lang = 'vi'): Promise<LearningMethod> {
    const { data } = await api.get<LearningMethod>(`/learning-methods/${id}`, {
      params: { lang },
    })
    return data
  },
}
