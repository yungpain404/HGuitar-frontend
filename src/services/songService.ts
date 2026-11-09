import api from '@/lib/api'
import type { Song, SongSource, GuitarDifficulty } from '@/types'

export const songService = {
  /**
   * Lấy danh sách bài hát dễ đánh.
   */
  async getSongs(params?: {
    source?: SongSource
    difficulty?: GuitarDifficulty
    lang?: 'vi' | 'en'
  }): Promise<Song[]> {
    const query: Record<string, string> = {}
    if (params?.source) query.source = params.source
    if (params?.difficulty) query.difficulty = params.difficulty
    if (params?.lang) query.lang = params.lang
    const { data } = await api.get<Song[]>('/songs', { params: query })
    return data
  },

  /**
   * Lấy chi tiết 1 bài hát kèm hợp âm và phân khúc.
   */
  async getSong(id: string, lang = 'vi'): Promise<Song> {
    const { data } = await api.get<Song>(`/songs/${id}`, { params: { lang } })
    return data
  },
}
