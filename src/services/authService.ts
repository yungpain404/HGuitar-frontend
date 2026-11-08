import api from '@/lib/api'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types'

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async loginWithFirebase(idToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/google', { idToken })
    return data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken })
  },
}
