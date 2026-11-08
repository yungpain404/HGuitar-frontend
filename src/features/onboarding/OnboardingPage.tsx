import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { GuitarTypeIcon } from '@/components/brand/GuitarTypeIcon'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type { GuitarType } from '@/types'

const OPTIONS: GuitarType[] = ['ACOUSTIC', 'CLASSICAL']

export function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<GuitarType | null>(null)
  useDocumentTitle(t('onboarding.title'))

  const statusQuery = useQuery({
    queryKey: ['onboarding'],
    queryFn: () => userService.getOnboardingStatus(),
  })

  // Fall back to the saved choice until the learner picks a different option.
  const selectedType = selected ?? statusQuery.data?.guitarType ?? null

  const completeMutation = useMutation({
    mutationFn: (guitarType: GuitarType) => userService.completeOnboarding(guitarType),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onboarding'] })
      navigate('/learn', { replace: true })
    },
  })

  function handleContinue() {
    if (!selectedType) return
    completeMutation.mutate(selectedType)
  }

  return (
    <section className="stage-lines relative min-h-[calc(100vh-4rem)] overflow-hidden bg-ink px-5 py-14 text-cream-100 sm:px-8 sm:py-20">
      <div
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-grape-500/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-cream-200/55">
          <span>{t('onboarding.step')}</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span>01 / 01</span>
        </div>

        <h1 className="display-title mt-8 max-w-2xl text-4xl text-cream-50 sm:text-5xl">
          {t('onboarding.title')}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-200/55">
          {t('onboarding.sub')}
        </p>

        {statusQuery.isError && (
          <div className="mt-8">
            <ErrorState message={t('common.error')} onRetry={() => void statusQuery.refetch()} />
          </div>
        )}

        {statusQuery.data?.completed && statusQuery.data.guitarType && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream-200/55">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            {t('onboarding.current', {
              type:
                statusQuery.data.guitarType === 'ACOUSTIC'
                  ? t('guitar.acoustic')
                  : t('guitar.classical'),
            })}
          </p>
        )}

        <div
          role="group"
          aria-label={t('onboarding.title')}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {OPTIONS.map((type) => {
            const active = selectedType === type
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(type)}
                className={cn(
                  'group relative overflow-hidden rounded-[2rem] border p-6 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:p-7',
                  active
                    ? 'border-amber-400 bg-cream-50 text-ink shadow-card'
                    : 'border-white/15 bg-white/[0.04] text-cream-100 hover:border-white/35 hover:bg-white/[0.07]',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'text-[10px] font-semibold uppercase tracking-[0.22em]',
                      active ? 'text-amber-600' : 'text-cream-200/55',
                    )}
                  >
                    {type === 'ACOUSTIC' ? '01 · Acoustic' : '02 · Classical'}
                  </span>
                  <GuitarTypeIcon
                    type={type}
                    className={active ? 'text-grape-700' : 'text-cream-200/55'}
                  />
                </div>

                <p className="mt-8 font-display text-2xl font-semibold">
                  {type === 'ACOUSTIC' ? t('onboarding.acoustic') : t('onboarding.classical')}
                </p>
                <p
                  className={cn(
                    'mt-2 text-sm leading-relaxed',
                    active ? 'text-ink/55' : 'text-cream-200/60',
                  )}
                >
                  {type === 'ACOUSTIC' ? t('onboarding.acousticDesc') : t('onboarding.classicalDesc')}
                </p>

                <span
                  className={cn(
                    'mt-6 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold',
                    active
                      ? 'border-amber-500 bg-amber-400 text-ink'
                      : 'border-white/20 text-transparent',
                  )}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            variant="amber"
            disabled={!selectedType}
            loading={completeMutation.isPending}
            onClick={handleContinue}
          >
            {completeMutation.isPending ? t('onboarding.saving') : t('onboarding.continue')}
            <span aria-hidden="true">→</span>
          </Button>
          <p className="text-xs text-cream-200/55">{t('onboarding.changeLater')}</p>
        </div>

        {completeMutation.isError && (
          <p role="alert" className="mt-4 text-sm font-medium text-amber-300">
            {t('onboarding.error')}
          </p>
        )}
      </div>
    </section>
  )
}
