import api from '@/lib/api'
import type {
  StrummingPattern,
  StrummingPatternDetail,
  StrummingInstruction,
} from '@/types'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type GuitarType = 'ACOUSTIC' | 'CLASSICAL' | 'ALL'

export const strummingService = {
  /**
   * Lấy danh sách cách đánh (công thức). Chỉ trả về những công thức PUBLISHED.
   */
  async getStrummingPatterns(params?: {
    guitarType?: GuitarType
    difficulty?: Difficulty
  }): Promise<StrummingPattern[]> {
    const query: Record<string, string> = {}
    if (params?.guitarType) query.guitarType = params.guitarType
    if (params?.difficulty) query.difficulty = params.difficulty
    const { data } = await api.get<StrummingPattern[]>('/strumming-patterns', {
      params: query,
    })
    return data
  },

  /**
   * Lấy chi tiết 1 cách đánh kèm theo hướng dẫn từng bước (instructions).
   */
  async getStrummingPattern(id: string): Promise<StrummingPatternDetail> {
    const { data } = await api.get<StrummingPatternDetail>(
      `/strumming-patterns/${id}`,
    )
    return data
  },

  /**
   * Lấy danh sách hướng dẫn từng bước của 1 cách đánh.
   */
  async getStrummingInstructions(
    patternId: string,
    lang = 'vi',
  ): Promise<StrummingInstruction[]> {
    const { data } = await api.get<StrummingInstruction[]>(
      `/strumming-patterns/${patternId}/instructions`,
      { params: { lang } },
    )
    return data
  },
}
