import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface Tab {
  to: string
  label: string
  icon: 'home' | 'learn' | 'chords' | 'strumming' | 'songs' | 'progress'
  end?: boolean
}

function TabIcon({ icon }: { icon: Tab['icon'] }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (icon === 'home') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    )
  }

  if (icon === 'learn') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10.5h5" />
      </svg>
    )
  }

  if (icon === 'chords') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
        <path d="M6 3v18M11 3v18M16 3v18M21 3v18M3 8h20M3 16h20" />
      </svg>
    )
  }

  if (icon === 'strumming') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
        <path d="M6 4l4 16M12 4l-4 16M18 4l-4 16" />
        <path d="M8 12h8M8 16h4" />
      </svg>
    )
  }

  if (icon === 'songs') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
        <path d="M9 18V5l12-2v13" />
        <path d="M9 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
    </svg>
  )
}

export function MobileTabBar() {
  const { t } = useTranslation()

  const tabs: Tab[] = [
    { to: '/', label: t('nav.home'), icon: 'home', end: true },
    { to: '/learn', label: t('nav.learn'), icon: 'learn' },
    { to: '/chords', label: t('nav.chords'), icon: 'chords' },
    { to: '/strumming-patterns', label: t('nav.strumming'), icon: 'strumming' },
    { to: '/songs', label: t('nav.songs'), icon: 'songs' },
    { to: '/progress', label: t('nav.progress'), icon: 'progress' },
  ]

  return (
    <nav
      aria-label={t('nav.mobileLabel')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
                isActive ? 'text-grape-700' : 'text-ink/55',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-grape-100' : 'bg-transparent',
                  )}
                >
                  <TabIcon icon={tab.icon} />
                </span>
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
