import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'

/**
 * Soft full-content overlay used while an initial page query or a mutation is
 * in flight. It sits below the navbar, blurs the page lightly, and fades in/out
 * so it never feels like a hard page flash.
 */
export function GlobalLoadingIndicator() {
  const { t } = useTranslation()
  const fetching = useIsFetching({
    predicate: (query) => query.state.data === undefined,
  })
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!active}
      className={cn(
        'fixed inset-x-0 bottom-0 top-16 z-30 flex items-center justify-center bg-cream-100/55 backdrop-blur-[3px] transition-opacity duration-500',
        active ? 'pointer-events-auto cursor-wait opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div className="flex flex-col items-center gap-3 rounded-[1.75rem] border border-ink/5 bg-cream-50/90 px-9 py-7 shadow-card">
        <Spinner className="h-9 w-9 border-[3px]" label={t('common.loading')} />
        <p className="text-sm font-medium text-ink/55">{t('common.loading')}</p>
      </div>
    </div>
  )
}
