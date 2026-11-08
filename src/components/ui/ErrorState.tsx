import { useTranslation } from 'react-i18next'
import { Button } from './Button'

interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: Props) {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className="rounded-3xl border border-red-200/70 bg-red-50/60 px-6 py-8 text-center"
    >
      <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M10 6v4m0 3h.01M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <p className="text-sm font-medium text-red-800">{message ?? t('common.error')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}
