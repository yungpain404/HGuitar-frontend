import type { ChordFinger } from './chords'

export interface DemoChord {
  name: string
  fingers: ChordFinger[]
}

/** Common open chords used by the landing-page demo and chord teaser. */
export const OPEN_CHORDS: DemoChord[] = [
  {
    name: 'Am',
    fingers: [
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  {
    name: 'C',
    fingers: [
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 0 },
      { string: 2, fret: 1, finger: 1 },
      { string: 1, fret: 0 },
      { string: 6, fret: -1 },
    ],
  },
  {
    name: 'G',
    fingers: [
      { string: 6, fret: 3, finger: 2 },
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 0 },
      { string: 3, fret: 0 },
      { string: 2, fret: 0 },
      { string: 1, fret: 3, finger: 3 },
    ],
  },
  {
    name: 'D',
    fingers: [
      { string: 4, fret: 0 },
      { string: 3, fret: 2, finger: 1 },
      { string: 2, fret: 3, finger: 3 },
      { string: 1, fret: 2, finger: 2 },
      { string: 5, fret: -1 },
      { string: 6, fret: -1 },
    ],
  },
]
