import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChordFinger } from '@/lib/chords'
import { cn } from '@/lib/cn'

interface Props {
  name: string
  fingers: ChordFinger[]
  baseFret?: number
  className?: string
}

const STRINGS = 6
const FRETS = 5
const WIDTH = 136
const HEIGHT = 174
const LEFT = 22
const RIGHT = 114
const TOP = 38
const STRING_GAP = (RIGHT - LEFT) / (STRINGS - 1)
const FRET_GAP = 22
const BOTTOM = TOP + FRET_GAP * FRETS

const stringX = (stringNumber: number) => RIGHT - (stringNumber - 1) * STRING_GAP

export function ChordDiagram({ name, fingers, baseFret = 1, className }: Props) {
  const { t } = useTranslation()
  const titleId = useId()

  const fretted = fingers.filter((finger) => finger.fret > 0)
  const lowestFret = fretted.length > 0 ? Math.min(...fretted.map((finger) => finger.fret)) : 1
  const effectiveBase = baseFret > 1 ? baseFret : lowestFret > FRETS ? lowestFret : 1

  const byString = new Map<number, ChordFinger>()
  fingers.forEach((finger) => byString.set(finger.string, finger))

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn('h-auto w-32', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{t('chords.diagramLabel', { name })}</title>

      {/* Strings */}
      {Array.from({ length: STRINGS }, (_, index) => {
        const x = LEFT + index * STRING_GAP
        return (
          <line
            key={`string-${index}`}
            x1={x}
            y1={TOP}
            x2={x}
            y2={BOTTOM}
            stroke="#170D1F"
            strokeOpacity={index === 0 ? 0.55 : 0.3}
            strokeWidth={index === 0 ? 1.4 : 1}
          />
        )
      })}

      {/* Frets */}
      {Array.from({ length: FRETS + 1 }, (_, index) => {
        const y = TOP + index * FRET_GAP
        const isNut = index === 0 && effectiveBase === 1
        return (
          <line
            key={`fret-${index}`}
            x1={LEFT}
            y1={y}
            x2={RIGHT}
            y2={y}
            stroke="#170D1F"
            strokeOpacity={isNut ? 1 : 0.16}
            strokeWidth={isNut ? 4 : 1}
          />
        )
      })}

      {effectiveBase > 1 && (
        <text x="2" y={TOP + 14} fontSize="10" fontWeight="600" fill="#6D28D9">
          {t('chords.baseFretShort', { fret: effectiveBase })}
        </text>
      )}

      {/* Open / muted markers */}
      {Array.from({ length: STRINGS }, (_, index) => {
        const stringNumber = STRINGS - index
        const finger = byString.get(stringNumber)
        const x = stringX(stringNumber)
        if (!finger) return null

        if (finger.fret === 0) {
          return (
            <circle
              key={`marker-${stringNumber}`}
              cx={x}
              cy={20}
              r={4.5}
              fill="none"
              stroke="#6D28D9"
              strokeWidth={1.5}
            />
          )
        }

        if (finger.fret === -1) {
          return (
            <g key={`marker-${stringNumber}`} stroke="#170D1F" strokeOpacity="0.4" strokeWidth={1.5}>
              <line x1={x - 4} y1={16} x2={x + 4} y2={24} />
              <line x1={x + 4} y1={16} x2={x - 4} y2={24} />
            </g>
          )
        }

        return null
      })}

      {/* Finger dots */}
      {fretted.map((finger) => {
        const relativeFret = finger.fret - effectiveBase + 1
        if (relativeFret < 1 || relativeFret > FRETS) return null

        const x = stringX(finger.string)
        const y = TOP + (relativeFret - 0.5) * FRET_GAP

        return (
          <g key={`dot-${finger.string}-${finger.fret}`}>
            <circle cx={x} cy={y} r={7.5} fill="#6D28D9" />
            {finger.finger && (
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#FFFCF6"
              >
                {finger.finger}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
