import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/auth-context'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GuitarTypeIcon } from '@/components/brand/GuitarTypeIcon'
import { ChordDiagram } from '@/components/music/ChordDiagram'
import { OPEN_CHORDS } from '@/lib/openChords'
import { HeroInstrument } from './HeroInstrument'

export function HomePage() {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  useDocumentTitle(null)

  const stats = [
    { value: t('home.stat1Value'), label: t('home.stat1Label') },
    { value: t('home.stat2Value'), label: t('home.stat2Label') },
    { value: t('home.stat3Value'), label: t('home.stat3Label') },
    { value: t('home.stat4Value'), label: t('home.stat4Label') },
  ]

  const steps = [
    { number: '01', title: t('home.how1Title'), body: t('home.how1Desc') },
    { number: '02', title: t('home.how2Title'), body: t('home.how2Desc') },
    { number: '03', title: t('home.how3Title'), body: t('home.how3Desc') },
  ]

  return (
    <div
      className="bg-cream-100 h-full overflow-y-scroll scroll-snap-type-y-mandatory scrollbar-hide"
      data-scroll-snap-container
    >
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-ink text-cream-100 scroll-snap-align-start min-h-[100dvh]"
        data-scroll-snap-section
      >
        <div className="stage-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-grape-600/25 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber-500/15 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <p className="eyebrow-light">{t('home.eyebrow')}</p>

              <h1 className="display-title mt-5 text-[clamp(2.9rem,6vw,4.7rem)] text-cream-50">
                {t('home.headline1')}
                <br />
                <span className="italic text-grape-300">{t('home.headline2')}</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-200/60">
                {t('home.sub')}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate(isLoggedIn ? '/learn' : '/register')}
                  className="shadow-glow"
                >
                  {isLoggedIn ? t('home.ctaLogin') : t('home.cta')}
                  <span aria-hidden="true">→</span>
                </Button>
                <Button
                  size="lg"
                  variant="inverse"
                  onClick={() => navigate('/learn')}
                >
                  {t('home.browseCourses')}
                </Button>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-cream-200/55">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                {t('home.note')}
              </p>
            </div>

            <HeroInstrument />
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-7 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-medium text-cream-50">{stat.value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cream-200/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Paths */}
      <section
        className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 scroll-snap-align-start min-h-[100dvh]"
        data-scroll-snap-section
      >
        <div className="grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="eyebrow">{t('home.pathsEyebrow')}</p>
            <h2 className="display-title mt-3 max-w-xl text-4xl text-ink sm:text-5xl">
              {t('home.pathsTitle')}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-ink/55 md:pb-2">{t('home.pathsSub')}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            to="/learn?guitarType=ACOUSTIC"
            className="card-lift group relative overflow-hidden rounded-[2rem] border border-ink/10 bg-[#F8E8CB] p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500"
          >
            <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-amber-400/40 blur-2xl" aria-hidden="true" />
            <div className="relative flex items-start justify-between">
              <Badge variant="outline">01 · Acoustic</Badge>
              <GuitarTypeIcon type="ACOUSTIC" className="text-amber-600" />
            </div>
            <h3 className="relative mt-8 font-display text-3xl font-semibold text-ink">
              {t('home.acoustic')}
            </h3>
            <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
              {t('home.acousticDesc')}
            </p>
            <ul className="relative mt-6 flex flex-col gap-2 text-sm text-ink/65">
              {[t('home.acousticTopic1'), t('home.acousticTopic2'), t('home.acousticTopic3')].map((topic) => (
                <li key={topic} className="flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden="true" />
                  {topic}
                </li>
              ))}
            </ul>
            <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              {t('home.explorePath')} <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link
            to="/learn?guitarType=CLASSICAL"
            className="card-lift group relative overflow-hidden rounded-[2rem] border border-ink/10 bg-grape-100 p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500"
          >
            <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-grape-300/40 blur-2xl" aria-hidden="true" />
            <div className="relative flex items-start justify-between">
              <Badge variant="outline">02 · Classical</Badge>
              <GuitarTypeIcon type="CLASSICAL" className="text-grape-700" />
            </div>
            <h3 className="relative mt-8 font-display text-3xl font-semibold text-ink">
              {t('home.classical')}
            </h3>
            <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
              {t('home.classicalDesc')}
            </p>
            <ul className="relative mt-6 flex flex-col gap-2 text-sm text-ink/65">
              {[t('home.classicalTopic1'), t('home.classicalTopic2'), t('home.classicalTopic3')].map((topic) => (
                <li key={topic} className="flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full bg-ink/40" aria-hidden="true" />
                  {topic}
                </li>
              ))}
            </ul>
            <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              {t('home.explorePath')} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-y border-ink/10 bg-cream-50 scroll-snap-align-start min-h-[100dvh]"
        data-scroll-snap-section
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
            <div>
              <p className="eyebrow">{t('home.howEyebrow')}</p>
              <h2 className="display-title mt-3 max-w-xl text-4xl text-ink sm:text-5xl">
                {t('home.howTitle')}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ink/55 md:pb-2">{t('home.howSub')}</p>
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="relative border-t border-ink/15 pt-7">
                <span className="absolute -top-0.5 left-0 h-0.5 w-12 bg-grape-600" aria-hidden="true" />
                <p className="font-display text-5xl font-medium text-grape-600/20">{step.number}</p>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Chord teaser */}
      <section
        className="relative overflow-hidden bg-plum-900 text-cream-100 scroll-snap-align-start min-h-[100dvh]"
        data-scroll-snap-section
      >
        <div className="stage-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-grape-500/25 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow-light">{t('home.chordsEyebrow')}</p>
              <h2 className="display-title mt-3 max-w-xl text-4xl text-cream-50 sm:text-5xl">
                {t('home.chordsTitle')}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream-200/55">
                {t('home.chordsSub')}
              </p>
            </div>
            <Link
              to="/chords"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cream-100 underline decoration-grape-300 underline-offset-4 transition hover:text-grape-200"
            >
              {t('home.chordsCta')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {OPEN_CHORDS.map((chord) => (
              <div
                key={chord.name}
                className="rounded-[1.5rem] border border-white/10 bg-cream-50 p-4 text-center shadow-card"
              >
                <p className="font-display text-2xl font-semibold text-ink">{chord.name}</p>
                <ChordDiagram name={chord.name} fingers={chord.fingers} className="mx-auto w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 scroll-snap-align-start min-h-[100dvh]"
        data-scroll-snap-section
      >
        <div className="relative overflow-hidden rounded-[2.5rem] bg-amber-300 px-6 py-12 sm:px-12 sm:py-16">
          <div className="fret-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="eyebrow text-amber-600">{t('home.finalEyebrow')}</p>
              <h2 className="display-title mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
                {t('home.finalTitle')}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">{t('home.finalSub')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(isLoggedIn ? '/learn' : '/register')}
              >
                {isLoggedIn ? t('home.ctaLogin') : t('home.finalCta')}
                <span aria-hidden="true">→</span>
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/chords')}>
                {t('home.finalSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
