import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GuitarIllustration } from '@/components/brand/GuitarIllustration'
import { ChordDiagram } from '@/components/music/ChordDiagram'
import { OPEN_CHORDS } from '@/lib/openChords'
import { cn } from '@/lib/cn'

export function HeroInstrument() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [strumKey, setStrumKey] = useState(0)

  const chord = OPEN_CHORDS[activeIndex]

  function strum() {
    setStrumKey((current) => current + 1)
  }

  function selectChord(index: number) {
    setActiveIndex(index)
    strum()
  }

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="absolute -inset-12 rounded-full bg-grape-500/25 blur-[90px]" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-4 shadow-glow backdrop-blur sm:p-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.24em] text-cream-200/60">
          <span>{t('home.stageLabel')}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {t('home.stringsLabel')}
          </span>
        </div>

        <GuitarIllustration
          strumKey={strumKey}
          className="mx-auto h-[330px] sm:h-[390px]"
        />

        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {OPEN_CHORDS.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={activeIndex === index}
              onClick={() => selectChord(index)}
              className={cn(
                'rounded-xl px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
                activeIndex === index
                  ? 'bg-cream-50 text-ink'
                  : 'bg-white/5 text-cream-200/70 hover:bg-white/10 hover:text-cream-50',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-cream-200/60">
          {t('home.tapHint')}
        </p>
      </div>

      {/* Floating chord card */}
      <div className="absolute -left-8 top-20 hidden rotate-[-7deg] rounded-[1.75rem] bg-cream-50 p-3 shadow-card sm:block">
        <p className="px-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-grape-600">
          {t('home.nowPlaying')}
        </p>
        <p className="px-1 font-display text-lg font-semibold text-ink">{chord.name}</p>
        <ChordDiagram name={chord.name} fingers={chord.fingers} className="w-[104px]" />
      </div>

      {/* Strum control */}
      <button
        type="button"
        onClick={strum}
        aria-label={t('home.strum')}
        className="absolute -bottom-4 right-3 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_12px_30px_-12px_rgba(247,178,103,0.9)] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 12.5c1.8.8 1.8 3.2 0 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {t('home.strum')}
      </button>
    </div>
  )
}
