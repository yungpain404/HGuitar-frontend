import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { strummingService } from '@/services/strummingService'
import { PageShell } from '@/components/layout/PageShell'
import { StrummingFormula } from '@/components/music/StrummingFormula'
import { StrummingInstructionStep } from '@/components/music/StrummingInstructionStep'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function StrummingPatternDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  useDocumentTitle(t('strumming.detailTitle'))

  const { data: pattern, isLoading, isError } = useQuery({
    queryKey: ['strummingPattern', id],
    queryFn: () => strummingService.getStrummingPattern(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingState label={t('common.loading')} />
  if (isError) return <ErrorState message={t('strumming.loadError')} />
  if (!pattern) return <ErrorState message={t('strumming.notFound')} />

  return (
    <PageShell narrow>
      <header className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h1 className="font-display text-3xl font-bold text-ink">
            {pattern.name}
          </h1>
          <Badge variant="muted">{pattern.difficulty}</Badge>
        </div>

        <StrummingFormula formula={pattern.formula} size="lg" className="mb-3" />

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-grape-500" />
            {t('strumming.down')}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-sage-500" />
            {t('strumming.up')}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-ink/20" />
            {t('strumming.pause')}
          </span>
          <span className="h-px w-px bg-ink/10" />
          <span>
            {t('strumming.bpm', {
              min: pattern.bpmMin ?? '-',
              max: pattern.bpmMax ?? '-',
            })}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-amber-400/50" />
            {t(`guitar.${pattern.guitarType.toLowerCase()}`)}
          </span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">
          {t('strumming.description')}
        </h2>
        <p className="text-sm leading-relaxed text-ink/60">
          {pattern.description}
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          {t('strumming.stepByStep')}
        </h2>

        {pattern.instructions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/20 bg-ink/5 px-6 py-8 text-center text-sm text-ink/50">
            {t('strumming.noInstructions')}
          </p>
        ) : (
          <ul className="space-y-3">
            {pattern.instructions.map((step) => (
              <li key={step.id}>
                <StrummingInstructionStep step={step} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 pt-4 border-t border-ink/10 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-grape-500" />
          <span className="text-xs font-medium text-ink/50 uppercase tracking-wider">
            {t('strumming.useMetronomeHint')}
          </span>
        </div>
      </section>
    </PageShell>
  )
}
