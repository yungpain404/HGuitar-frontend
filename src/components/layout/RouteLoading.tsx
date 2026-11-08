import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'

/** Suspense fallback used while a lazily loaded route chunk is downloaded. */
export function RouteLoading() {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[55vh] items-center justify-center px-5 py-16"
    >
      <div className="flex flex-col items-center gap-3 rounded-[1.75rem] border border-ink/5 bg-cream-50/90 px-9 py-7 shadow-soft">
        <Spinner className="h-9 w-9 border-[3px]" label={t('common.loading')} />
        <p className="text-sm font-medium text-ink/55">{t('common.loading')}</p>
      </div>
    </div>
  )
}
