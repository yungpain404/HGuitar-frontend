import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { learningService } from '@/services/learningService'
import { progressService } from '@/services/progressService'
import { useAuth } from '@/context/auth-context'
import { useLocale } from '@/hooks/useLocale'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageShell } from '@/components/layout/PageShell'
import { LessonContent } from '@/components/learning/LessonContent'
import { QuizPanel } from './QuizPanel'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { cn } from '@/lib/cn'

interface CompletionCardProps {
  isLoggedIn: boolean
  isCompleted: boolean
  isPending: boolean
  isError: boolean
  onComplete: () => void
  onLogin: () => void
}

function CompletionCard({
  isLoggedIn,
  isCompleted,
  isPending,
  isError,
  onComplete,
  onLogin,
}: CompletionCardProps) {
  const { t } = useTranslation()

  if (isCompleted) {
    return (
      <div className="rounded-[1.5rem] border border-sage-600/20 bg-sage-100 p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-cream-50">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="m5 10.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-3 font-display text-lg font-semibold text-ink">{t('learn.completionDone')}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/55">{t('learn.completionDoneDesc')}</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-plum-800 p-5 text-cream-100">
      <div className="stage-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <p className="eyebrow-light">{t('learn.completionEyebrow')}</p>
        <p className="mt-2 font-display text-lg font-semibold text-cream-50">
          {t('learn.completionTitle')}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-cream-200/60">
          {isLoggedIn ? t('learn.completionDesc') : t('learn.loginToTrack')}
        </p>

        {isLoggedIn ? (
          <Button
            className="mt-4 w-full"
            variant="amber"
            size="sm"
            loading={isPending}
            onClick={onComplete}
          >
            {isPending ? t('learn.markingComplete') : t('learn.markComplete')}
          </Button>
        ) : (
          <Button
            className="mt-4 w-full"
            variant="inverse"
            size="sm"
            onClick={onLogin}
          >
            {t('learn.loginToComplete')}
          </Button>
        )}

        {isError && (
          <p role="alert" className="mt-3 text-xs font-medium text-amber-300">
            {t('learn.markCompleteError')}
          </p>
        )}
      </div>
    </div>
  )
}

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const { t } = useTranslation()
  const lang = useLocale()
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [justCompleted, setJustCompleted] = useState<string | null>(null)

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId, lang],
    queryFn: () => learningService.getLesson(lessonId as string, lang),
    enabled: Boolean(lessonId),
  })

  const moduleId = lessonQuery.data?.moduleId

  const moduleQuery = useQuery({
    queryKey: ['module', moduleId, lang],
    queryFn: () => learningService.getModule(moduleId as string, lang),
    enabled: Boolean(moduleId),
  })

  const courseId = moduleQuery.data?.courseId

  const courseQuery = useQuery({
    queryKey: ['course', courseId, lang],
    queryFn: () => learningService.getCourse(courseId as string, lang),
    enabled: Boolean(courseId),
  })

  const blocksQuery = useQuery({
    queryKey: ['lesson-blocks', lessonId, lang],
    queryFn: () => learningService.getBlocks(lessonId as string, lang),
    enabled: Boolean(lessonId),
  })

  const lessonsQuery = useQuery({
    queryKey: ['lessons', moduleId, lang],
    queryFn: () => learningService.getLessons(moduleId as string, lang),
    enabled: Boolean(moduleId),
  })

  const progressQuery = useQuery({
    queryKey: ['progress', lang],
    queryFn: () => progressService.getUserProgress(lang),
    enabled: isLoggedIn,
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => learningService.completeLesson(id, lang),
    onSuccess: (result) => {
      setJustCompleted(result.lessonId)
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })

  useDocumentTitle(lessonQuery.data?.title)

  if (lessonQuery.isLoading) return <PageShell><LoadingState /></PageShell>

  if (lessonQuery.isError || !lessonQuery.data) {
    return (
      <PageShell>
        <ErrorState onRetry={() => void lessonQuery.refetch()} />
        <p className="mt-6 text-center text-sm">
          <Link to="/learn" className="text-grape-700 underline underline-offset-4">
            {t('learn.backToCourses')}
          </Link>
        </p>
      </PageShell>
    )
  }

  const lesson = lessonQuery.data
  const module = moduleQuery.data
  const course = courseQuery.data

  const isCompleted =
    justCompleted === lesson.id ||
    progressQuery.data?.lessons.some(
      (item) => item.lessonId === lesson.id && item.status === 'COMPLETED',
    ) === true

  const lessons = lessonsQuery.data ?? []
  const currentIndex = lessons.findIndex((item) => item.id === lesson.id)
  const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : undefined

  const completionCard = (
    <CompletionCard
      isLoggedIn={isLoggedIn}
      isCompleted={isCompleted}
      isPending={completeMutation.isPending}
      isError={completeMutation.isError}
      onComplete={() => completeMutation.mutate(lesson.id)}
      onLogin={() => navigate('/login', { state: { from: location.pathname } })}
    />
  )

  const nextLessonCard = nextLesson ? (
    <Link
      to={`/learn/lessons/${nextLesson.id}`}
      className="group block rounded-[1.5rem] border border-ink/10 bg-cream-50 p-5 transition hover:border-grape-300 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
        {t('learn.nextLesson')}
      </p>
      <p className="mt-2 font-display text-lg font-semibold text-ink transition group-hover:text-grape-700">
        {nextLesson.title}
      </p>
      <span className="mt-2 inline-flex items-center gap-1 text-sm text-ink/60">
        {t('learn.continueLesson')} <span aria-hidden="true">→</span>
      </span>
    </Link>
  ) : (
    <div className="rounded-[1.5rem] border border-ink/10 bg-cream-50 p-5">
      <p className="text-sm leading-relaxed text-ink/55">{t('learn.lastLesson')}</p>
      {module && (
        <Link
          to={`/learn/modules/${module.id}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-grape-700"
        >
          {t('learn.backToModule')} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink/55">
          <Link to="/learn" className="transition hover:text-ink">
            {t('learn.courses')}
          </Link>
          {course && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                to={`/learn/courses/${course.id}`}
                className="max-w-40 truncate transition hover:text-ink"
              >
                {course.title}
              </Link>
            </>
          )}
          {module && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                to={`/learn/modules/${module.id}`}
                className="max-w-40 truncate transition hover:text-ink"
              >
                {module.title}
              </Link>
            </>
          )}
        </nav>

        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isCompleted ? 'success' : 'default'}>
              {isCompleted ? t('learn.completed') : t('learn.lessonNumber', { n: lesson.sortOrder })}
            </Badge>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">
              {t('learn.duration', { n: lesson.durationMinutes })}
            </span>
          </div>
          <h1 className="display-title mt-4 text-4xl text-ink sm:text-5xl">{lesson.title}</h1>
          {lesson.description && (
            <p className="mt-4 text-base leading-relaxed text-ink/55">{lesson.description}</p>
          )}
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0">
            <div className="rounded-[2rem] border border-ink/10 bg-cream-50 p-6 sm:p-8">
              {blocksQuery.isLoading && <LoadingState />}
              {blocksQuery.isError && <ErrorState onRetry={() => void blocksQuery.refetch()} />}
              {blocksQuery.data && <LessonContent blocks={blocksQuery.data} />}
            </div>

            <div className="mt-8">
              <QuizPanel key={lesson.id} lessonId={lesson.id} />
            </div>

            <div className="mt-8 flex flex-col gap-4 lg:hidden">
              {completionCard}
              {nextLessonCard}
            </div>
          </div>

          <aside className="sticky top-24 hidden flex-col gap-4 lg:flex">
            <div className="rounded-[1.5rem] border border-ink/10 bg-cream-50 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                {t('learn.inThisLesson')}
              </p>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink/60">{t('learn.durationLabel')}</dt>
                  <dd className="font-medium text-ink">{t('learn.duration', { n: lesson.durationMinutes })}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink/60">{t('learn.statusLabel')}</dt>
                  <dd className={cn('font-medium', isCompleted ? 'text-sage-600' : 'text-ink')}>
                    {isCompleted
                      ? t('learn.completed')
                      : isLoggedIn
                        ? t('learn.inProgress')
                        : t('learn.notStarted')}
                  </dd>
                </div>
                {lessons.length > 0 && currentIndex >= 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink/60">{t('learn.positionLabel')}</dt>
                    <dd className="font-medium text-ink">
                      {currentIndex + 1} / {lessons.length}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {completionCard}
            {nextLessonCard}
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
