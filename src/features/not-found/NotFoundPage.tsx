import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageShell } from '@/components/layout/PageShell'

export function NotFoundPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('common.notFound'))

  return (
    <PageShell narrow>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-cream-50 px-6 py-20 text-center">
        <div className="stage-lines pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
        <div className="relative">
          <p className="font-display text-[7rem] font-semibold leading-none text-grape-600/15">404</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            {t('common.notFound')}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
            {t('common.notFoundDesc')}
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream-50"
          >
            {t('common.backHome')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
