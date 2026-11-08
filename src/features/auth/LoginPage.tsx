import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/context/auth-context'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import type { AuthResponse } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type FormData = {
  email: string
  password: string
}

/** Only allow internal redirect targets supplied by the router or query string. */
function safeNextPath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//')) return null
  return value
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')
  useDocumentTitle(t('auth.login'))

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('validation.email')),
        password: z.string().min(1, t('validation.required')),
      }),
    [t],
  )

  const fromState = (location.state as { from?: unknown } | null)?.from
  const nextPath =
    safeNextPath(fromState) ?? safeNextPath(searchParams.get('next')) ?? '/learn'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function resolveDestination(): Promise<string> {
    try {
      const status = await userService.getOnboardingStatus()
      if (!status.completed) return '/onboarding'
    } catch {
      // A failed status check must not block login.
    }
    return nextPath
  }

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const auth = await authService.login(data)
      login(auth)
      navigate(await resolveDestination(), { replace: true })
    } catch {
      setServerError(t('auth.loginError'))
    }
  }

  async function handleGoogle(auth: AuthResponse) {
    login(auth)
    navigate(await resolveDestination(), { replace: true })
  }

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSub')}>
      <GoogleSignInButton onAuthenticated={handleGoogle} />

      <div className="my-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
        {t('auth.or')}
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          <span aria-hidden="true">→</span>
        </Button>
      </form>

      <p className="mt-3 text-sm text-ink/60">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-grape-700 underline underline-offset-4">
          {t('auth.register')}
        </Link>
      </p>
    </AuthLayout>
  )
}
