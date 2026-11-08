import { useTranslation } from 'react-i18next'

interface Props {
  label?: string
}

/**
 * Quiet skeleton used inside a page while data is on its way. The single
 * spinning indicator is rendered by GlobalLoadingIndicator / RouteLoading, so
 * this component deliberately avoids a second competing spinner.
 */
export function LoadingState({ label }: Props) {
  const { t } = useTranslation()

  return (
    <div role="status" aria-live="polite" className="py-8">
      <span className="sr-only">{label ?? t('common.loading')}</span>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <div className="h-4 w-36 animate-pulse rounded-full bg-ink/[0.06]" />
        <div className="h-24 animate-pulse rounded-[1.5rem] bg-ink/[0.05]" />
        <div className="h-16 w-3/4 animate-pulse rounded-[1.5rem] bg-ink/[0.04]" />
      </div>
    </div>
  )
}
