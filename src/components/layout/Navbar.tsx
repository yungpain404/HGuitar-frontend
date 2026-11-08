import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/Button'
import { GuitarMark } from '@/components/brand/GuitarMark'
import { cn } from '@/lib/cn'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'relative py-2 text-sm font-medium transition-colors hover:text-ink',
    isActive ? 'text-ink' : 'text-ink/55',
  )
}

export function Navbar() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn, displayName, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const activeLanguage = i18n.language.startsWith('vi') ? 'vi' : 'en'

  function changeLanguage(language: 'vi' | 'en') {
    void i18n.changeLanguage(language)
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/')
    } finally {
      setLoggingOut(false)
    }
  }

  const initial = (displayName ?? 'H').trim().charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream-100/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label={t('nav.home')}>
          <GuitarMark />
          <span className="font-display text-xl font-semibold tracking-tight text-grape-700">HGuitar</span>
        </Link>

        <nav aria-label={t('nav.mainLabel')} className="hidden items-center gap-7 sm:flex">
          <NavLink to="/learn" className={navLinkClass}>
            {({ isActive }) => (
              <>
                {t('nav.learn')}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grape-600" />
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/chords" className={navLinkClass}>
            {({ isActive }) => (
              <>
                {t('nav.chords')}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grape-600" />
                )}
              </>
            )}
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/progress" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {t('nav.progress')}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-grape-600" />
                  )}
                </>
              )}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={t('nav.switchLanguage')}
            className="hidden items-center rounded-full border border-ink/10 bg-cream-50 p-0.5 sm:flex"
          >
            {(['vi', 'en'] as const).map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => changeLanguage(language)}
                aria-pressed={activeLanguage === language}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500',
                  activeLanguage === language
                    ? 'bg-ink text-cream-50'
                    : 'text-ink/55 hover:text-ink/70',
                )}
              >
                {language}
              </button>
            ))}
          </div>

          {isLoggedIn ? (
            <>
              <Link
                to="/progress"
                className="hidden items-center gap-2 rounded-full border border-ink/10 bg-cream-50 py-1 pl-1 pr-3 text-xs font-medium text-ink/70 transition hover:border-ink/30 sm:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-grape-100 text-[11px] font-bold text-grape-700">
                  {initial}
                </span>
                <span className="max-w-28 truncate">{displayName ?? t('nav.account')}</span>
              </Link>
              <Button variant="ghost" size="sm" loading={loggingOut} onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                {t('nav.register')}
              </Button>
            </>
          )}

          <button
            type="button"
            onClick={() => changeLanguage(activeLanguage === 'vi' ? 'en' : 'vi')}
            aria-label={t('nav.switchLanguage')}
            className="rounded-full border border-ink/10 bg-cream-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60 sm:hidden"
          >
            {activeLanguage === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>
      </div>
    </header>
  )
}
