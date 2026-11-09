import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { LearningMethod } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
  method: LearningMethod
}

export function LearningMethodCard({ method }: Props) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/learning-methods/${method.id}`}
      className={cn(
        'card-lift group flex flex-col rounded-[2rem] border border-ink/10 bg-cream-50 p-5 hover:border-ink/20 transition',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="font-display text-xl font-semibold text-ink leading-snug">
          {method.title}
        </h2>
        <Badge variant="muted">{method.difficulty}</Badge>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink/55 line-clamp-2">
        {method.description}
      </p>

      <div className="mt-auto pt-3 border-t border-ink/10 flex items-center justify-between gap-2 text-xs text-ink/60">
        <span>
          {t('learningMethods.weeks', { n: method.estimatedWeeks })}
        </span>
        <span>
          {t('learningMethods.steps', { n: method.stepsCount })}
        </span>
        <Badge variant="outline">{method.targetGuitar}</Badge>
      </div>
    </Link>
  )
}
