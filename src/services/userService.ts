import api from '@/lib/api'
import type { GuitarType, OnboardingStatus, UserProfile } from '@/types'

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/users/me')
    return data
  },

  async getOnboardingStatus(): Promise<OnboardingStatus> {
    const { data } = await api.get<OnboardingStatus>('/onboarding/status')
    return data
  },

  async completeOnboarding(guitarType: GuitarType): Promise<OnboardingStatus> {
    const { data } = await api.post<OnboardingStatus>('/onboarding/complete', { guitarType })
    return data
  },
}
