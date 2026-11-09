import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { songService } from '@/services/songService'
import { chordService } from '@/services/chordService'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLocale } from '@/hooks/useLocale'
import { ChordDiagram } from '@/components/music/ChordDiagram'
import { parseChordFingers } from '@/lib/chords'
import { cn } from '@/lib/cn'

export function SongDetailPage() {
  const { t } = useTranslation()
  const lang = useLocale()
  const { id } = useParams<{ id: string }>()

  useDocumentTitle(t('songs.detailTitle'))

  const { data: song, isLoading, isError } = useQuery({
    queryKey: ['song', id, lang],
    queryFn: () => songService.getSong(id!, lang),
    enabled: !!id,
  })

  // Lấy chi tiết từng hợp âm để vẽ sơ đồ vị trí ngón tay.
  const chordIds = song?.chords.map((c) => c.chordId) ?? []
  const { data: chordDetails } = useQuery({
    queryKey: ['song-chords', chordIds],
    queryFn: () => Promise.all(chordIds.map((cid) => chordService.getChord(cid))),
    enabled: chordIds.length > 0,
  })

  if (isLoading) return <LoadingState label={t('common.loading')} />
  if (isError) return <ErrorState message={t('songs.loadError')} />
  if (!song) return <ErrorState message={t('songs.notFound')} />

  const chordById = new Map(
    chordDetails?.map((c) => [c.id, c]) ?? [],
  )

  return (
    <PageShell narrow>
      <header className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="font-display text-3xl font-bold text-ink">
            {song.title}
          </h1>
          <Badge variant="muted">{song.difficulty}</Badge>
        </div>

        <p className="text-lg text-ink/60">{song.artist}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink/60">
          <span>{t('songs.source', { source: song.source === 'VIETNAMESE' ? t('songs.sourceVietnamese') : t('songs.sourceForeign') })}</span>
          <span className="h-px w-px bg-ink/10" />
          {song.originalKey && (
            <span>
              {t('songs.key')} <span className="font-medium text-ink">{song.originalKey}</span>
            </span>
          )}
          {song.capoFret > 0 && (
            <span>
              {t('songs.capo', { fret: song.capoFret })}
            </span>
          )}
          {song.bpm && (
            <span>
              {t('songs.bpm', { bpm: song.bpm })}
            </span>
          )}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">
          {t('songs.description')}
        </h2>
        {song.description && <p className="text-sm leading-relaxed text-ink/60">{song.description}</p>}
      </section>

      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          {t('songs.chordsNeeded')}
        </h2>
        <p className="text-sm text-ink/55 mb-4">
          {t('songs.chordsNeededDesc', { count: song.chords.length })}
        </p>
        <div className="flex flex-wrap gap-5">
          {song.chords.map((chord) => {
            const chordDetail = chordById.get(chord.chordId)
            const firstPosition = chordDetail?.positions[0]
            const fingers = firstPosition ? parseChordFingers(firstPosition.fingersJson) : []

            return (
              <div
                key={chord.chordId}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border border-ink/10 bg-cream-50 p-4',
                  chord.isRequired ? 'border-amber-200 bg-amber-50/40' : '',
                )}
              >
                <h3 className="font-display text-sm font-semibold text-ink">
                  {chord.chordName}
                </h3>
                {chord.isRequired && (
                  <span className="text-[10px] font-medium text-amber-600">
                    {t('songs.required')}
                  </span>
                )}
                <ChordDiagram
                  name={chord.chordName}
                  fingers={fingers}
                  className="w-24 h-28"
                />
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          {t('songs.sections')}
        </h2>
        <ul className="space-y-3">
          {song.sections.map((section) => (
            <li
              key={section.id}
              className="rounded-xl border border-ink/10 bg-cream-50 p-4"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-ink/60 uppercase tracking-wider">
                  {section.sectionType.charAt(0) + section.sectionType.slice(1).toLowerCase()}
                </span>
                {section.name && (
                  <span className="text-xs text-ink/45">{section.name}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm font-mono text-ink">
                {section.chordProgression.split(' | ').map((chord, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded border border-ink/20 bg-white text-ink/90">
                    {chord}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
