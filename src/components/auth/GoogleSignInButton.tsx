import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isFirebaseConfigured } from '@/lib/firebaseConfig'
import { authService } from '@/services/authService'
import type { AuthResponse } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
  onAuthenticated: (auth: AuthResponse) => void | Promise<void>
  className?: string
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3.01h3.87c2.26-2.08 3.57-5.15 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  )
}

function errorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: unknown }).code ?? '')
  }
  return ''
}

export function GoogleSignInButton({ onAuthenticated, className }: Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setError('')

    if (!isFirebaseConfigured) {
      setError(t('auth.googleNotConfigured'))
      return
    }

    setLoading(true)
    try {
      // Load the Firebase SDK lazily so it does not inflate the initial bundle
      // for people who sign in with email/password.
      const { signInWithGoogle } = await import('@/lib/firebase')
      const idToken = await signInWithGoogle()
      const auth = await authService.loginWithFirebase(idToken)
      await onAuthenticated(auth)
    } catch (caught: unknown) {
      const code = errorCode(caught)

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // The learner closed the account picker; this is not an error worth
        // interrupting them with.
        return
      }
      if (code === 'auth/popup-blocked') {
        setError(t('auth.googlePopupBlocked'))
      } else if (code === 'auth/unauthorized-domain') {
        setError(t('auth.googleUnauthorizedDomain'))
      } else if (caught instanceof Error && caught.message === 'FIREBASE_NOT_CONFIGURED') {
        setError(t('auth.googleNotConfigured'))
      } else {
        setError(t('auth.googleError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        title={!isFirebaseConfigured ? t('auth.googleNotConfigured') : undefined}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/30 hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-r-transparent"
          />
        ) : (
          <GoogleGlyph />
        )}
        {loading ? t('auth.googleConnecting') : t('auth.continueWithGoogle')}
      </button>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
