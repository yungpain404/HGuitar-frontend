import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { progressService } from '@/services/progressService'
import { useLocale } from '@/hooks/useLocale'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { LessonProgressItem } from '@/types'

function formatDate(value: string | null, language: string): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(language.startsWith('vi') ? 'vi-VN' : 'en-US', {
    dateStyle: 'long',
  }).format(date)
}

function ProgressRow({ item, language }: { item: LessonProgressItem; language: string }) {
  const { t } = useTranslation()
  const completedDate = formatDate(item.completedAt, language)
  const isCompleted = item.status === 'COMPLETED'

  return (
    <li>
      <Link
        to={`/learn/lessons/${item.lessonId}`}
        className="group flex items-center justify-between gap-4 rounded-2xl px-3 py-4 transition hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={
              isCompleted
                ? 'mt-1 h-2 w-2 shrink-0 rounded-full bg-sage-600'
                : 'mt-1 h-2 w-2 shrink-0 rounded-full bg-grape-500'
            }
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium text-ink">
                {item.title || t('progress.untitledLesson')}
              </p>
              <Badge variant={isCompleted ? 'success' : 'default'}>
                {isCompleted ? t('progress.completed') : t('progress.inProgress')}
              </Badge>
            </div>
            {isCompleted && completedDate && (
              <p className="mt-0.5 text-xs text-ink/55">
                {t('progress.completedOn', { date: completedDate })}
              </p>
            )}
          </div>
        </div>
        <span
          aria-hidden="true"
          className="text-ink/20 transition group-hover:translate-x-0.5 group-hover:text-grape-700"
        >
          →
        </span>
      </Link>
    </li>
  )
}

export function ProgressPage() {
  const { t, i18n } = useTranslation()
  const lang = useLocale()
  useDocumentTitle(t('progress.title'))

  const { data: progress, isLoading, isError, refetch } = useQuery({
    queryKey: ['progress', lang],
    queryFn: () => progressService.getUserProgress(lang),
  })

  const completed = (progress?.lessons ?? [])
    .filter((item) => item.status === 'COMPLETED')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

  const inProgress = (progress?.lessons ?? []).filter((item) => item.status === 'IN_PROGRESS')

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('progress.eyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">{t('progress.title')}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">{t('progress.sub')}</p>
      </header>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={t('progress.loadError')} onRetry={() => void refetch()} />}

      {progress && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="stage-lines relative overflow-hidden rounded-[2rem] bg-ink px-7 py-8 text-cream-100">
              <div
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-grape-500/30 blur-3xl"
                aria-hidden="true"
              />
              <p className="eyebrow-light">{t('progress.totalLabel')}</p>
              <div className="relative mt-4 flex items-end gap-3">
                <p className="font-display text-7xl font-semibold leading-none text-cream-50">
                  {progress.totalLessonsCompleted}
                </p>
                <p className="pb-2 text-sm text-cream-200/55">
                  {progress.totalLessonsCompleted === 1
                    ? t('progress.lessonCompleted')
                    : t('progress.lessonsCompleted')}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] bg-grape-100 p-7">
              <div>
                <p className="eyebrow">{t('progress.keepGoingEyebrow')}</p>
                <p className="mt-3 font-display text-2xl font-semibold leading-snug text-ink">
                  {t('progress.keepGoingTitle')}
                </p>
              </div>
              <Link
                to="/learn"
                className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-grape-700 underline decoration-grape-300 underline-offset-4"
              >
                {t('progress.keepLearning')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {progress.lessons.length === 0 ? (
            <div className="mt-8 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
              <p className="font-display text-xl text-ink">{t('progress.noProgress')}</p>
              <Link
                to="/learn"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-grape-700 underline underline-offset-4"
              >
                {t('progress.keepLearning')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div
              className={
                inProgress.length > 0 && completed.length > 0
                  ? 'mt-8 grid gap-5 lg:grid-cols-2'
                  : 'mt-8 grid gap-5 lg:grid-cols-1'
              }
            >
              {inProgress.length > 0 && (
                <section aria-labelledby="in-progress-heading" className="rounded-[2rem] border border-ink/10 bg-cream-50 p-5">
                  <h2 id="in-progress-heading" className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                    {t('progress.inProgressLessons')}
                  </h2>
                  <ul className="divide-y divide-ink/10">
                    {inProgress.map((item) => (
                      <ProgressRow key={item.lessonId} item={item} language={i18n.language} />
                    ))}
                  </ul>
                </section>
              )}

              {completed.length > 0 && (
                <section aria-labelledby="completed-heading" className="rounded-[2rem] border border-ink/10 bg-cream-50 p-5">
                  <h2 id="completed-heading" className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                    {t('progress.completedLessons')}
                  </h2>
                  <ul className="divide-y divide-ink/10">
                    {completed.map((item) => (
                      <ProgressRow key={item.lessonId} item={item} language={i18n.language} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
