import api from '@/lib/api'
import type { Chord } from '@/types'

export const chordService = {
  async getChords(guitarType?: string): Promise<Chord[]> {
    const params: Record<string, string> = {}
    if (guitarType) params.guitarType = guitarType
    const { data } = await api.get<Chord[]>('/chords', { params })
    return data
  },

  async getChord(id: string): Promise<Chord> {
    const { data } = await api.get<Chord>(`/chords/${id}`)
    return data
  },
}
