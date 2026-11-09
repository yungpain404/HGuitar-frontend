import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { Song } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
  song: Song
}

export function SongCard({ song }: Props) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/songs/${song.id}`}
      className={cn(
        'card-lift group flex flex-col rounded-[2rem] border border-ink/10 bg-cream-50 p-5 hover:border-ink/20 transition',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="font-display text-xl font-semibold text-ink leading-snug">
          {song.title}
        </h2>
        <Badge variant="muted">{song.difficulty}</Badge>
      </div>

      <p className="text-sm text-ink/55">{song.artist}</p>

      {song.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink/55 line-clamp-2">
          {song.description}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-ink/60">
          <span className="font-medium">Hợp âm:</span>
          <span className="font-medium text-ink">
            {song.chords.map((c) => c.chordName).join(' · ')}
          </span>
        </div>
        <Badge variant="outline">
          {song.source === 'VIETNAMESE' ? t('songs.vietnamese') : t('songs.foreign')}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-ink/45 uppercase tracking-wider">
        <span className="h-1 w-1 rounded-full bg-sage-500" />
        {t('songs.tapToLearn')}
      </div>
    </Link>
  )
}
