import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { StrummingFormula } from '@/components/music/StrummingFormula'
import type { StrummingPattern } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
  pattern: StrummingPattern
}

export function StrummingPatternCard({ pattern }: Props) {
  const { t } = useTranslation()

  const isAcousticOrAll =
    pattern.guitarType === 'ACOUSTIC' || pattern.guitarType === 'ALL'

  return (
    <Link
      to={`/strumming-patterns/${pattern.id}`}
      className={cn(
        'card-lift group flex flex-col rounded-[2rem] border border-ink/10 bg-cream-50 p-5 hover:border-ink/20 transition',
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="font-display text-2xl font-semibold text-ink leading-snug">
          {pattern.name}
        </h2>
        <Badge variant="muted">{pattern.difficulty}</Badge>
      </div>

      <StrummingFormula formula={pattern.formula} size="lg" className="mb-3" />

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-ink/10">
        <div className="flex items-center gap-1 text-xs text-ink/60">
          <span className="font-medium">BPM</span>
          {pattern.bpmMin && pattern.bpmMax ? (
            <span>{pattern.bpmMin} – {pattern.bpmMax}</span>
          ) : (
            <span>-</span>
          )}
        </div>
        <Badge variant={isAcousticOrAll ? 'amber' : 'default'}>
          {pattern.guitarType === 'ALL'
            ? t('chords.all')
            : t(`guitar.${pattern.guitarType.toLowerCase()}`)}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/55 line-clamp-2">
        {pattern.description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-ink/45 uppercase tracking-wider">
        <span className="h-1 w-1 rounded-full bg-grape-500" />
        {t('strumming.tapToPractice')}
      </div>
    </Link>
  )
}
