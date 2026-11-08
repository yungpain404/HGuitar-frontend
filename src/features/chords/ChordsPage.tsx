import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { chordService } from '@/services/chordService'
import { parseChordFingers } from '@/lib/chords'
import { ChordDiagram } from '@/components/music/ChordDiagram'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type { GuitarType } from '@/types'

type ChordFilter = GuitarType | 'ALL'

const FILTERS: ChordFilter[] = ['ALL', 'ACOUSTIC', 'CLASSICAL']

export function ChordsPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<ChordFilter>('ALL')
  useDocumentTitle(t('chords.title'))

  const { data: chords, isLoading, isError, refetch } = useQuery({
    queryKey: ['chords', filter],
    queryFn: () => chordService.getChords(filter === 'ALL' ? undefined : filter),
  })

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('chords.eyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">{t('chords.title')}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">{t('chords.sub')}</p>
      </header>

      <div
        role="group"
        aria-label={t('chords.filterLabel')}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
              filter === value
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            {value === 'ALL' && t('chords.all')}
            {value === 'ACOUSTIC' && t('guitar.acoustic')}
            {value === 'CLASSICAL' && t('guitar.classical')}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={t('chords.loadError')} onRetry={() => void refetch()} />}

      {chords && chords.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">{t('chords.noChords')}</p>
          <p className="mt-2 text-sm text-ink/60">{t('chords.emptyHint')}</p>
        </div>
      )}

      {chords && chords.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chords.map((chord) => {
            const isAcoustic = chord.guitarType === 'ACOUSTIC'

            return (
              <li
                key={chord.id}
                className="card-lift group flex flex-col rounded-[2rem] border border-ink/10 bg-cream-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-3xl font-semibold text-ink">{chord.name}</h2>
                  <Badge variant={isAcoustic ? 'amber' : 'default'}>
                    {t(`guitar.${chord.guitarType.toLowerCase()}`)}
                  </Badge>
                </div>

                {chord.positions.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-start justify-center gap-5 rounded-[1.5rem] bg-cream-100/80 px-3 py-4">
                    {chord.positions.map((position) => (
                      <figure key={position.id} className="flex flex-col items-center gap-1.5">
                        <ChordDiagram
                          name={chord.name}
                          fingers={parseChordFingers(position.fingersJson)}
                          baseFret={position.baseFret}
                          className="w-28 transition duration-300 group-hover:scale-[1.03]"
                        />
                        {chord.positions.length > 1 && (
                          <figcaption className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink/55">
                            {t('chords.positionN', { n: position.positionNumber })}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl bg-cream-100 px-4 py-8 text-center text-xs text-ink/55">
                    {t('chords.noPositions')}
                  </p>
                )}

                {chord.description && (
                  <p className="mt-4 text-sm leading-relaxed text-ink/55">{chord.description}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
