import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { learningMethodService } from '@/services/learningMethodService'
import { PageShell } from '@/components/layout/PageShell'
import { LearningMethodCard } from '@/components/learning/LearningMethodCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type { GuitarDifficulty } from '@/types'
import { useLocale } from '@/hooks/useLocale'

type DifficultyFilter = GuitarDifficulty | 'ALL'

const DIFFICULTY_FILTERS: DifficultyFilter[] = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export function LearningMethodsPage() {
  const { t } = useTranslation()
  const lang = useLocale()
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL')

  useDocumentTitle(t('learningMethods.title'))

  const { data: methods, isLoading, isError, refetch } = useQuery({
    queryKey: ['learningMethods', difficultyFilter, lang],
    queryFn: () =>
      learningMethodService.getLearningMethods({
        difficulty: difficultyFilter === 'ALL' ? undefined : difficultyFilter,
        lang,
      }),
  })

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('learningMethods.eyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
          {t('learningMethods.title')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">
          {t('learningMethods.sub')}
        </p>
      </header>

      <div
        role="group"
        aria-label={t('learningMethods.filterLabel')}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {DIFFICULTY_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={difficultyFilter === value}
            onClick={() => setDifficultyFilter(value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
              difficultyFilter === value
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            {value === 'ALL' && t('strumming.allLevels')}
            {value === 'BEGINNER' && t('strumming.beginner')}
            {value === 'INTERMEDIATE' && t('strumming.intermediate')}
            {value === 'ADVANCED' && t('strumming.advanced')}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState label={t('common.loading')} />}
      {isError && (
        <ErrorState
          message={t('learningMethods.loadError')}
          onRetry={() => void refetch()}
        />
      )}

      {methods && methods.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">
            {t('learningMethods.noMethods')}
          </p>
        </div>
      )}

      {methods && methods.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => (
            <li key={method.id}>
              <LearningMethodCard method={method} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
