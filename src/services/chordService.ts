import api from '@/lib/api'
import type { Chord } from '@/types'

export const chordService = {
  async getChords(params?: { guitarType?: string; category?: string }): Promise<Chord[]> {
    const query: Record<string, string> = {}
    if (params?.guitarType) query.guitarType = params.guitarType
    if (params?.category) query.category = params.category
    const { data } = await api.get<Chord[]>('/chords', { params })
    return data
  },

  async getChord(id: string): Promise<Chord> {
    const { data } = await api.get<Chord>(`/chords/${id}`)
    return data
  },
}
