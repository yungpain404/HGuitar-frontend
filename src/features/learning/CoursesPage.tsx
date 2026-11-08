import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { learningService } from '@/services/learningService'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { GuitarTypeIcon } from '@/components/brand/GuitarTypeIcon'
import { useLocale } from '@/hooks/useLocale'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import type { GuitarType } from '@/types'

type CourseFilter = GuitarType | 'ALL'

const FILTERS: CourseFilter[] = ['ALL', 'ACOUSTIC', 'CLASSICAL']

export function CoursesPage() {
  const { t } = useTranslation()
  const lang = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  useDocumentTitle(t('learn.coursesTitle'))

  const requested = searchParams.get('guitarType')
  const filter: CourseFilter =
    requested === 'ACOUSTIC' || requested === 'CLASSICAL' ? requested : 'ALL'

  const { data: courses, isLoading, isError, refetch } = useQuery({
    queryKey: ['courses', lang, filter],
    queryFn: () => learningService.getCourses(lang, filter === 'ALL' ? undefined : filter),
  })

  function setFilter(next: CourseFilter) {
    setSearchParams(next === 'ALL' ? {} : { guitarType: next }, { replace: true })
  }

  return (
    <PageShell>
      <header className="max-w-2xl">
        <p className="eyebrow">{t('learn.coursesEyebrow')}</p>
        <h1 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
          {t('learn.coursesTitle')}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">{t('learn.coursesSub')}</p>
      </header>

      <div
        role="group"
        aria-label={t('learn.filterLabel')}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
              filter === value
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 text-ink/60 hover:border-ink/40 hover:text-ink',
            )}
          >
            {value === 'ALL' && t('learn.allCourses')}
            {value === 'ACOUSTIC' && t('guitar.acoustic')}
            {value === 'CLASSICAL' && t('guitar.classical')}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={() => void refetch()} />}

      {courses && courses.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">{t('learn.noCourses')}</p>
          <Link to="/chords" className="mt-3 inline-block text-sm text-grape-700 underline underline-offset-4">
            {t('home.chordsCta')}
          </Link>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {courses.map((course) => {
            const isAcoustic = course.guitarType === 'ACOUSTIC'

            return (
              <Link
                key={course.id}
                to={`/learn/courses/${course.id}`}
                className={cn(
                  'card-lift group relative overflow-hidden rounded-[2rem] border border-ink/10 p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
                  isAcoustic ? 'bg-[#F8E8CB]' : 'bg-grape-100',
                )}
              >
                <div
                  className={cn(
                    'absolute -right-16 -top-16 h-52 w-52 rounded-full blur-2xl',
                    isAcoustic ? 'bg-amber-400/40' : 'bg-grape-300/40',
                  )}
                  aria-hidden="true"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <Badge variant="outline">{t(`guitar.${course.guitarType.toLowerCase()}`)}</Badge>
                  <GuitarTypeIcon
                    type={course.guitarType}
                    className={isAcoustic ? 'text-amber-600' : 'text-grape-700'}
                  />
                </div>

                <h2 className="relative mt-8 font-display text-3xl font-semibold leading-tight text-ink">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="relative mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                    {course.description}
                  </p>
                )}

                <span className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {t('learn.viewCourse')} <span aria-hidden="true">→</span>
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
