import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { LessonBlock } from '@/types'
import { chordService } from '@/services/chordService'
import { parseChordFingers, parseMetadata, fingersFromMetadata } from '@/lib/chords'
import { ChordDiagram } from '@/components/music/ChordDiagram'
import { ErrorState } from '@/components/ui/ErrorState'

interface Props {
  blocks: LessonBlock[]
}

function renderBold(line: string): ReactNode[] {
  return line.split('**').map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

function RichText({ text }: { text: string }) {
  const paragraphs = text.split('\n')
  return (
    <>
      {paragraphs.map((line, index) => (
        <p key={index}>{line ? renderBold(line) : '\u00a0'}</p>
      ))}
    </>
  )
}

function safeMediaUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null

  try {
    const url = new URL(value, window.location.origin)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <p className="rounded-[1.5rem] border border-dashed border-ink/15 bg-cream-100/60 px-5 py-8 text-center text-sm text-ink/55">
      {label}
    </p>
  )
}

function ChordDiagramBlock({ block }: { block: LessonBlock }) {
  const { t } = useTranslation()
  const metadata = parseMetadata(block.metadataJson)
  const chordId = metadata && typeof metadata.chordId === 'string' ? metadata.chordId : null

  const { data: chord, isLoading, isError, refetch } = useQuery({
    queryKey: ['chord', chordId],
    queryFn: () => chordService.getChord(chordId as string),
    enabled: Boolean(chordId),
  })

  if (chordId) {
    if (isLoading) return <p className="text-sm text-ink/55">{t('common.loading')}</p>
    if (isError || !chord) {
      return <ErrorState message={t('learn.mediaUnavailable')} onRetry={() => void refetch()} />
    }

    return (
      <figure className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-ink/10 bg-cream-100/70 px-5 py-6">
        <figcaption className="font-display text-lg font-semibold text-ink">{chord.name}</figcaption>
        <div className="flex flex-wrap justify-center gap-6">
          {chord.positions.map((position) => (
            <ChordDiagram
              key={position.id}
              name={chord.name}
              fingers={parseChordFingers(position.fingersJson)}
              baseFret={position.baseFret}
              className="w-40"
            />
          ))}
        </div>
      </figure>
    )
  }

  const name = metadata && typeof metadata.name === 'string' ? metadata.name : ''
  const fingers = fingersFromMetadata(metadata)
  const baseFret =
    metadata && typeof metadata.baseFret === 'number' && metadata.baseFret > 0 ? metadata.baseFret : 1

  if (!name || fingers.length === 0) {
    return <MediaPlaceholder label={t('learn.mediaUnavailable')} />
  }

  return (
    <figure className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-ink/10 bg-cream-100/70 px-5 py-6">
      <figcaption className="font-display text-lg font-semibold text-ink">{name}</figcaption>
      <ChordDiagram name={name} fingers={fingers} baseFret={baseFret} className="w-40" />
    </figure>
  )
}

function BlockView({ block }: { block: LessonBlock }) {
  const { t } = useTranslation()
  const metadata = parseMetadata(block.metadataJson)

  switch (block.blockType) {
    case 'TEXT':
      return (
        <div className="flex flex-col gap-3 text-[15px] leading-[1.85] text-ink/70">
          <RichText text={block.content} />
        </div>
      )

    case 'PRACTICE_INSTRUCTION':
      return (
        <section className="rounded-[1.5rem] border border-amber-400/40 bg-amber-300/20 px-5 py-4">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            {t('learn.practice')}
          </p>
          <div className="flex flex-col gap-3 text-[15px] leading-[1.85] text-ink/75">
            <RichText text={block.content} />
          </div>
        </section>
      )

    case 'IMAGE': {
      const url = safeMediaUrl(metadata?.url)
      if (!url) return <MediaPlaceholder label={t('learn.mediaUnavailable')} />
      const alt = typeof metadata?.alt === 'string' ? metadata.alt : ''
      return (
        <figure className="flex flex-col gap-2">
          <img src={url} alt={alt} loading="lazy" className="w-full rounded-[1.5rem] border border-ink/10" />
          {block.content && <figcaption className="text-xs text-ink/60">{block.content}</figcaption>}
        </figure>
      )
    }

    case 'AUDIO': {
      const url = safeMediaUrl(metadata?.url)
      if (!url) return <MediaPlaceholder label={t('learn.mediaUnavailable')} />
      return (
        <div className="flex flex-col gap-2">
          <audio controls src={url} className="w-full" />
          {block.content && <p className="text-xs text-ink/60">{block.content}</p>}
        </div>
      )
    }

    case 'VIDEO': {
      const url = safeMediaUrl(metadata?.url)
      if (!url) return <MediaPlaceholder label={t('learn.mediaUnavailable')} />
      return (
        <div className="flex flex-col gap-2">
          <video controls src={url} className="w-full rounded-[1.5rem] border border-ink/10" />
          {block.content && <p className="text-xs text-ink/60">{block.content}</p>}
        </div>
      )
    }

    case 'CHORD_DIAGRAM':
      return <ChordDiagramBlock block={block} />

    default:
      return null
  }
}

export function LessonContent({ blocks }: Props) {
  const { t } = useTranslation()

  if (blocks.length === 0) {
    return (
      <p className="rounded-[1.5rem] border border-dashed border-ink/15 bg-cream-100/50 px-5 py-10 text-center text-sm text-ink/55">
        {t('learn.contentUnavailable')}
      </p>
    )
  }

  const ordered = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="flex flex-col gap-8">
      {ordered.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </div>
  )
}
