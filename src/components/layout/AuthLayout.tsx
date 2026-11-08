import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { GuitarIllustration } from '@/components/brand/GuitarIllustration'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: Props) {
  const { t } = useTranslation()

  return (
    <main className="bg-cream-100 lg:min-h-[calc(100vh-4rem)]">
      <div className="mx-auto grid max-w-6xl lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="stage-lines relative hidden overflow-hidden bg-ink px-10 py-8 text-cream-100 lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-grape-500/30 blur-[110px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-8 opacity-25"
            aria-hidden="true"
          >
            <GuitarIllustration className="w-[290px]" />
          </div>

          <div className="relative max-w-md">
            <p className="eyebrow-light">{t('auth.asideEyebrow')}</p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-[1.1] text-cream-50">
              {t('auth.asideTitle')}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-200/60">
              {t('auth.asideSub')}
            </p>
          </div>

          <div className="relative">
            <ul className="flex flex-col gap-2 text-sm text-cream-200/70">
              {[t('auth.asidePoint1'), t('auth.asidePoint2'), t('auth.asidePoint3')].map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-cream-200/45">
              {t('auth.noTheoryNote')}
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-6 sm:px-10">
          <div className="w-full max-w-md">
            <p className="eyebrow">{t('auth.formEyebrow')}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{subtitle}</p>

            <div className="mt-5">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}
