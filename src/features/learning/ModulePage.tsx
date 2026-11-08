import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { learningService } from '@/services/learningService'
import { progressService } from '@/services/progressService'
import { useAuth } from '@/context/auth-context'
import { useLocale } from '@/hooks/useLocale'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { LessonProgressStatus } from '@/types'

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { t } = useTranslation()
  const lang = useLocale()
  const { isLoggedIn } = useAuth()

  const moduleQuery = useQuery({
    queryKey: ['module', moduleId, lang],
    queryFn: () => learningService.getModule(moduleId as string, lang),
    enabled: Boolean(moduleId),
  })

  const lessonsQuery = useQuery({
    queryKey: ['lessons', moduleId, lang],
    queryFn: () => learningService.getLessons(moduleId as string, lang),
    enabled: Boolean(moduleId),
  })

  const courseQuery = useQuery({
    queryKey: ['course', moduleQuery.data?.courseId, lang],
    queryFn: () => learningService.getCourse(moduleQuery.data?.courseId as string, lang),
    enabled: Boolean(moduleQuery.data?.courseId),
  })

  const progressQuery = useQuery({
    queryKey: ['progress', lang],
    queryFn: () => progressService.getUserProgress(lang),
    enabled: isLoggedIn,
  })

  useDocumentTitle(moduleQuery.data?.title)

  if (moduleQuery.isLoading) return <PageShell><LoadingState /></PageShell>

  if (moduleQuery.isError || !moduleQuery.data) {
    return (
      <PageShell>
        <ErrorState onRetry={() => void moduleQuery.refetch()} />
        <p className="mt-6 text-center text-sm">
          <Link to="/learn" className="text-grape-700 underline underline-offset-4">
            {t('learn.backToCourses')}
          </Link>
        </p>
      </PageShell>
    )
  }

  const module = moduleQuery.data
  const lessons = lessonsQuery.data ?? []
  const course = courseQuery.data

  const progressByLesson = new Map<string, LessonProgressStatus>()
  progressQuery.data?.lessons.forEach((item) => {
    progressByLesson.set(item.lessonId, item.status)
  })

  const completedCount = lessons.filter(
    (lesson) => progressByLesson.get(lesson.id) === 'COMPLETED',
  ).length

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink/55">
        <Link to="/learn" className="transition hover:text-ink">
          {t('learn.courses')}
        </Link>
        <span aria-hidden="true">/</span>
        {course && (
          <>
            <Link
              to={`/learn/courses/${course.id}`}
              className="max-w-48 truncate transition hover:text-ink"
            >
              {course.title}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="truncate text-ink/60">{module.title}</span>
      </nav>

      <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>{t('learn.moduleNumber', { n: module.sortOrder })}</Badge>
          <h1 className="display-title mt-4 max-w-2xl text-4xl text-ink sm:text-5xl">
            {module.title}
          </h1>
          {module.description && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/55">
              {module.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-5 text-sm text-ink/60">
          <span>{t('learn.lessonCount', { n: lessons.length })}</span>
          {isLoggedIn && lessons.length > 0 && (
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-grape-600" aria-hidden="true" />
              {t('learn.completedCount', { done: completedCount, total: lessons.length })}
            </span>
          )}
        </div>
      </header>

      {lessonsQuery.isLoading && <LoadingState />}
      {lessonsQuery.isError && <ErrorState onRetry={() => void lessonsQuery.refetch()} />}

      {!lessonsQuery.isLoading && !lessonsQuery.isError && lessons.length === 0 && (
        <p className="mt-8 rounded-3xl border border-dashed border-ink/20 py-12 text-center text-sm text-ink/60">
          {t('learn.noLessons')}
        </p>
      )}

      {lessons.length > 0 && (
        <ol className="mt-6 flex flex-col gap-3">
          {lessons.map((lesson, index) => {
            const status = progressByLesson.get(lesson.id)

            return (
              <li key={lesson.id}>
                <Link
                  to={`/learn/lessons/${lesson.id}`}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-ink/10 bg-cream-50 p-4 transition hover:border-grape-300 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500 sm:gap-5 sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200/70 font-display text-sm font-semibold text-ink/60 transition group-hover:bg-grape-600 group-hover:text-cream-50">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold text-ink">{lesson.title}</h2>
                      {status === 'COMPLETED' && (
                        <Badge variant="success">{t('learn.completed')}</Badge>
                      )}
                      {status === 'IN_PROGRESS' && <Badge>{t('learn.inProgress')}</Badge>}
                    </div>
                    {lesson.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/60">
                        {lesson.description}
                      </p>
                    )}
                    <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/30">
                      {t('learn.duration', { n: lesson.durationMinutes })}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden text-lg text-ink/20 transition group-hover:translate-x-1 group-hover:text-grape-700 sm:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </PageShell>
  )
}
