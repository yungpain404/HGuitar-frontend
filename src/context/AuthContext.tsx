import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { AuthResponse } from '@/types'
import { authService } from '@/services/authService'
import { SESSION_CHANGED_EVENT, session, type StoredUser } from '@/lib/session'
import { AuthContext, type AuthState } from './auth-context'

const anonymousState: AuthState = {
  isLoggedIn: false,
  userId: null,
  email: null,
  displayName: null,
  roles: [],
}

function decodeLegacyToken(token: string): AuthState | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const payload = JSON.parse(atob(padded)) as {
      userId?: string
      sub?: string
      roles?: string[]
    }
    return {
      isLoggedIn: true,
      userId: payload.userId ?? null,
      email: payload.sub ?? null,
      displayName: null,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    }
  } catch {
    return null
  }
}

function stateFromStoredUser(user: StoredUser): AuthState {
  return {
    isLoggedIn: true,
    userId: user.userId,
    email: user.email,
    displayName: user.displayName || null,
    roles: user.roles,
  }
}

function getInitialState(): AuthState {
  const token = session.getAccessToken()
  if (!token) return anonymousState

  const storedUser = session.getUser()
  if (storedUser) return stateFromStoredUser(storedUser)

  // Sessions created before user details were persisted still carry identity
  // in the JWT payload.
  return decodeLegacyToken(token) ?? anonymousState
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState)

  const syncFromStorage = useCallback(() => {
    const token = session.getAccessToken()
    if (!token) {
      setState(anonymousState)
      return
    }
    const storedUser = session.getUser()
    setState(storedUser ? stateFromStoredUser(storedUser) : (decodeLegacyToken(token) ?? anonymousState))
  }, [])

  useEffect(() => {
    window.addEventListener(SESSION_CHANGED_EVENT, syncFromStorage)
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, syncFromStorage)
  }, [syncFromStorage])

  function login(auth: AuthResponse) {
    session.setAuth(auth)
    setState({
      isLoggedIn: true,
      userId: auth.userId,
      email: auth.email,
      displayName: auth.displayName,
      roles: auth.roles,
    })
  }

  async function logout() {
    const refreshToken = session.getRefreshToken()
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {
        // The local session is cleared even when the server call fails.
      }
    }
    session.clear()
    setState(anonymousState)
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
