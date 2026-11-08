import type { AuthResponse } from '@/types'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'authUser'

export const SESSION_CHANGED_EVENT = 'hguitar:session-changed'

export interface StoredUser {
  userId: string
  email: string
  displayName: string
  roles: string[]
}

function notifySessionChanged() {
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT))
}

export const session = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw) as Partial<StoredUser>
      if (typeof parsed.userId !== 'string' || typeof parsed.email !== 'string') return null
      return {
        userId: parsed.userId,
        email: parsed.email,
        displayName: typeof parsed.displayName === 'string' ? parsed.displayName : '',
        roles: Array.isArray(parsed.roles) ? parsed.roles.filter((r): r is string => typeof r === 'string') : [],
      }
    } catch {
      return null
    }
  },

  setAuth(auth: AuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        userId: auth.userId,
        email: auth.email,
        displayName: auth.displayName,
        roles: auth.roles,
      } satisfies StoredUser),
    )
    notifySessionChanged()
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    notifySessionChanged()
  },
}
