import { Suspense } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'
import { MobileTabBar } from './MobileTabBar'
import { RouteLoading } from './RouteLoading'
import { GlobalLoadingIndicator } from './GlobalLoadingIndicator'
import { GuitarMark } from '@/components/brand/GuitarMark'

const CURRENT_YEAR = new Date().getFullYear()

export function AppLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const chromeless = ['/login', '/register', '/onboarding'].includes(pathname)

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <GlobalLoadingIndicator />

      <div className="flex-1">
        <Suspense fallback={<RouteLoading />}>
          <Outlet />
        </Suspense>
      </div>

      {!chromeless && (
      <footer className="mt-16 bg-ink text-cream-100">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <GuitarMark className="h-8 w-8" />
                <span className="font-display text-xl font-semibold">HGuitar</span>
              </div>
              <p className="mt-6 max-w-md font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
                {t('common.footerTitle')}
              </p>
              <p className="mt-3 max-w-sm text-sm text-cream-200/55">
                {t('common.footerTagline')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream-200/55">
                  {t('common.footerExplore')}
                </p>
                <Link to="/learn" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.learn')}
                </Link>
                <Link to="/chords" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.chords')}
                </Link>
                <Link to="/strumming-patterns" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.strumming')}
                </Link>
                <Link to="/songs" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.songs')}
                </Link>
                <Link to="/progress" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.progress')}
                </Link>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream-200/55">
                  {t('common.footerStart')}
                </p>
                <Link to="/register" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.register')}
                </Link>
                <Link to="/login" className="text-cream-200/70 transition hover:text-cream-50">
                  {t('nav.login')}
                </Link>
                <span className="text-cream-200/55">VI · EN</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-cream-200/55 sm:flex-row sm:items-center sm:justify-between">
            <span>© {CURRENT_YEAR} HGuitar</span>
            <span>{t('common.footerMadeFor')}</span>
          </div>
        </div>
      </footer>
      )}

      {!chromeless && <MobileTabBar />}
    </div>
  )
}
