import { createContext, useContext } from 'react'
import type { AuthResponse } from '@/types'

export interface AuthState {
  isLoggedIn: boolean
  userId: string | null
  email: string | null
  displayName: string | null
  roles: string[]
}

export interface AuthContextValue extends AuthState {
  login: (auth: AuthResponse) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
