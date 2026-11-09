import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { songService } from '@/services/songService'
import { PageShell } from '@/components/layout/PageShell'
import { SongCard } from '@/components/song/SongCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type { SongSource, GuitarDifficulty } from '@/types'
import { useLocale } from '@/hooks/useLocale'

type SourceFilter = SongSource | 'ALL'
type DifficultyFilter = GuitarDifficulty | 'ALL'

const SOURCE_FILTERS: SourceFilter[] = ['ALL', 'VIETNAMESE', 'FOREIGN']
const DIFFICULTY_FILTERS: DifficultyFilter[] = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export function SongsPage() {
  const { t } = useTranslation()
  const lang = useLocale()
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL')

  useDocumentTitle(t('songs.title'))

  const { data: songs, isLoading, isError, refetch } = useQuery({
    queryKey: ['songs', sourceFilter, difficultyFilter, lang],
    queryFn: () =>
      songService.getSongs({
        source: sourceFilter === 'ALL' ? undefined : sourceFilter,
        difficulty: difficultyFilter === 'ALL' ? undefined : difficultyFilter,
        lang,
      }),
  })

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('songs.eyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
          {t('songs.title')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">
          {t('songs.sub')}
        </p>
      </header>

      <div
        role="group"
        aria-label={t('songs.filterLabel')}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {SOURCE_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={sourceFilter === value}
            onClick={() => setSourceFilter(value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
              sourceFilter === value
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            {value === 'ALL' && t('songs.allSources')}
            {value === 'VIETNAMESE' && t('songs.sourceVietnamese')}
            {value === 'FOREIGN' && t('songs.sourceForeign')}
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
          message={t('songs.loadError')}
          onRetry={() => void refetch()}
        />
      )}

      {songs && songs.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">
            {t('songs.noSongs')}
          </p>
          <p className="mt-2 text-sm text-ink/60">{t('songs.emptyHint')}</p>
        </div>
      )}

      {songs && songs.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <li key={song.id}>
              <SongCard song={song} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
