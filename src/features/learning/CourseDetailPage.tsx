import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { learningService } from '@/services/learningService'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { GuitarTypeIcon } from '@/components/brand/GuitarTypeIcon'
import { useLocale } from '@/hooks/useLocale'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const lang = useLocale()

  const courseQuery = useQuery({
    queryKey: ['course', id, lang],
    queryFn: () => learningService.getCourse(id as string, lang),
    enabled: Boolean(id),
  })

  const modulesQuery = useQuery({
    queryKey: ['modules', id, lang],
    queryFn: () => learningService.getModules(id as string, lang),
    enabled: Boolean(id),
  })

  useDocumentTitle(courseQuery.data?.title)

  if (courseQuery.isLoading) return <PageShell><LoadingState /></PageShell>

  if (courseQuery.isError || !courseQuery.data) {
    return (
      <PageShell>
        <ErrorState onRetry={() => void courseQuery.refetch()} />
        <p className="mt-6 text-center text-sm">
          <Link to="/learn" className="text-grape-700 underline underline-offset-4">
            {t('learn.backToCourses')}
          </Link>
        </p>
      </PageShell>
    )
  }

  const course = courseQuery.data
  const modules = modulesQuery.data ?? []
  const isAcoustic = course.guitarType === 'ACOUSTIC'

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink/55">
        <Link to="/learn" className="transition hover:text-ink">
          {t('learn.courses')}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-ink/60">{course.title}</span>
      </nav>

      <header
        className={cn(
          'relative overflow-hidden rounded-[2rem] border border-ink/10 px-7 py-9 sm:px-10 sm:py-12',
          isAcoustic ? 'bg-[#F8E8CB]' : 'bg-grape-100',
        )}
      >
        <div
          className={cn(
            'absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl',
            isAcoustic ? 'bg-amber-400/40' : 'bg-grape-300/50',
          )}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="outline">{t(`guitar.${course.guitarType.toLowerCase()}`)}</Badge>
            <h1 className="display-title mt-4 max-w-2xl text-4xl text-ink sm:text-5xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
                {course.description}
              </p>
            )}
          </div>
          <GuitarTypeIcon
            type={course.guitarType}
            className={isAcoustic ? 'h-20 w-20 text-amber-600/80' : 'h-20 w-20 text-grape-700/80'}
          />
        </div>
      </header>

      <div className="mt-12 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t('learn.modulesEyebrow')}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            {t('learn.modules')}
          </h2>
        </div>
        {modules.length > 0 && (
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink/55">
            {t('learn.moduleCount', { n: modules.length })}
          </span>
        )}
      </div>

      {modulesQuery.isLoading && <LoadingState />}
      {modulesQuery.isError && <ErrorState onRetry={() => void modulesQuery.refetch()} />}

      {!modulesQuery.isLoading && !modulesQuery.isError && modules.length === 0 && (
        <p className="mt-8 rounded-3xl border border-dashed border-ink/20 py-12 text-center text-sm text-ink/60">
          {t('learn.noModules')}
        </p>
      )}

      {modules.length > 0 && (
        <ol className="mt-6 flex flex-col">
          {modules.map((module, index) => (
            <li key={module.id} className="relative border-t border-ink/10 first:border-t-0">
              <Link
                to={`/learn/modules/${module.id}`}
                className="group flex items-start gap-5 py-6 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                    'border-ink/15 bg-cream-50 text-ink/60 group-hover:border-grape-600 group-hover:bg-grape-600 group-hover:text-cream-50',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-grape-700">
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/60">
                      {module.description}
                    </p>
                  )}
                </div>

                <span
                  aria-hidden="true"
                  className="pt-2 text-lg text-ink/25 transition group-hover:translate-x-1 group-hover:text-grape-700"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </PageShell>
  )
}
