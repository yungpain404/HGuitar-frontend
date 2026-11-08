import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse } from '@/types'
import { session } from './session'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Separate client for refreshing so a failing request cannot recurse through
// the response interceptor below.
const refreshClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshInFlight: Promise<boolean> | null = null

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = session.getRefreshToken()
      if (!refreshToken) return false

      try {
        const { data } = await refreshClient.post<AuthResponse>('/auth/refresh', { refreshToken })
        // The refresh response also carries the current user identity.
        session.setAuth(data)
        return true
      } catch {
        session.clear()
        return false
      } finally {
        refreshInFlight = null
      }
    })()
  }

  return refreshInFlight
}

function redirectToLogin() {
  const current = `${window.location.pathname}${window.location.search}`
  if (current.startsWith('/login')) return
  window.location.assign(`/login?next=${encodeURIComponent(current)}`)
}

// Attach the access token on each request.
api.interceptors.request.use((config) => {
  const token = session.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh the access token once on 401, then replay the original request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const url = original?.url ?? ''

    const isAuthEndpoint = url.startsWith('/auth/')
    if (status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    original._retry = true
    const refreshed = await refreshSession()

    if (refreshed) {
      const token = session.getAccessToken()
      if (token) original.headers.Authorization = `Bearer ${token}`
      return api(original)
    }

    session.clear()
    redirectToLogin()
    return Promise.reject(error)
  },
)

export default api
