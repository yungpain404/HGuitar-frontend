import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  displayName: string
  email: string
  password: string
}

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState('')
  useDocumentTitle(t('auth.register'))

  const schema = useMemo(
    () =>
      z.object({
        displayName: z
          .string()
          .trim()
          .min(1, t('validation.required'))
          .max(255, t('validation.tooLong')),
        email: z.string().email(t('validation.email')),
        password: z
          .string()
          .min(8, t('validation.passwordLength'))
          .max(100, t('validation.tooLong')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const auth = await authService.register(data)
      login(auth)
      navigate('/onboarding', { replace: true })
    } catch (error: unknown) {
      const status =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined

      setServerError(status === 409 ? t('auth.emailInUse') : t('auth.registerError'))
    }
  }

  async function handleGoogle(auth: AuthResponse) {
    login(auth)
    try {
      const status = await userService.getOnboardingStatus()
      navigate(status.completed ? '/learn' : '/onboarding', { replace: true })
    } catch {
      navigate('/onboarding', { replace: true })
    }
  }

  return (
    <AuthLayout title={t('auth.registerTitle')} subtitle={t('auth.registerSub')}>
      <GoogleSignInButton onAuthenticated={handleGoogle} />

      <div className="my-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45">
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
        {t('auth.or')}
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <Input
          id="displayName"
          type="text"
          label={t('auth.displayName')}
          placeholder={t('auth.namePlaceholder')}
          autoComplete="name"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <p className="-mt-1 text-xs text-ink/45">{t('auth.passwordHint')}</p>

        {serverError && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="mt-0.5 w-full">
          {isSubmitting ? t('auth.registering') : t('auth.register')}
          <span aria-hidden="true">→</span>
        </Button>
      </form>

      <p className="mt-3 text-sm text-ink/60">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="font-semibold text-grape-700 underline underline-offset-4">
          {t('auth.login')}
        </Link>
      </p>
    </AuthLayout>
  )
}
