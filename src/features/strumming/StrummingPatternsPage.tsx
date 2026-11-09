import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { strummingService } from '@/services/strummingService'
import { PageShell } from '@/components/layout/PageShell'
import { StrummingPatternCard } from '@/components/music/StrummingPatternCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type {
  StrummingGuitarType,
  StrummingDifficulty,
} from '@/types'
import { useLocale } from '@/hooks/useLocale'

type GuitarFilter = StrummingGuitarType | 'ALL'
type DifficultyFilter = StrummingDifficulty | 'ALL'

const GUITAR_FILTERS: GuitarFilter[] = ['ALL', 'ACOUSTIC', 'CLASSICAL']
const DIFFICULTY_FILTERS: DifficultyFilter[] = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export function StrummingPatternsPage() {
  const { t } = useTranslation()
  const lang = useLocale()
  const [guitarFilter, setGuitarFilter] = useState<GuitarFilter>('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL')

  useDocumentTitle(t('strumming.title'))

  const { data: patterns, isLoading, isError, refetch } = useQuery({
    queryKey: ['strummingPatterns', guitarFilter, difficultyFilter, lang],
    queryFn: () =>
      strummingService.getStrummingPatterns({
        guitarType: guitarFilter === 'ALL' ? undefined : guitarFilter,
        difficulty: difficultyFilter === 'ALL' ? undefined : difficultyFilter,
      }),
  })

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('strumming.eyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
          {t('strumming.title')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">
          {t('strumming.sub')}
        </p>
      </header>

      <div
        role="group"
        aria-label={t('strumming.filterLabel')}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {GUITAR_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={guitarFilter === value}
            onClick={() => setGuitarFilter(value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
              guitarFilter === value
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            {value === 'ALL' && t('strumming.allGuitars')}
            {value === 'ACOUSTIC' && t('guitar.acoustic')}
            {value === 'CLASSICAL' && t('guitar.classical')}
          </button>
        ))}

        <span className="mx-2 text-[10px] font-semibold uppercase text-ink/30">
          ·
        </span>

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
          message={t('strumming.loadError')}
          onRetry={() => void refetch()}
        />
      )}

      {patterns && patterns.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">
            {t('strumming.noPatterns')}
          </p>
          <p className="mt-2 text-sm text-ink/60">
            {t('strumming.emptyHint')}
          </p>
        </div>
      )}

      {patterns && patterns.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <li key={pattern.id}>
              <StrummingPatternCard pattern={pattern} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
