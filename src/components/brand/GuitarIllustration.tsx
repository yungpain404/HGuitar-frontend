import { useId, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  className?: string
  /** Change this value to replay the string vibration animation. */
  strumKey?: number
}

const STRING_X = [166, 171.6, 177.2, 182.8, 188.4, 194]

/**
 * Original flat-illustration acoustic guitar. The six strings can be animated
 * to give the landing page a small, physical moment without using audio.
 */
export function GuitarIllustration({ className, strumKey = 0 }: Props) {
  const uid = useId().replace(/:/g, '')
  const bodyGradient = `body-${uid}`
  const neckGradient = `neck-${uid}`
  const glow = `glow-${uid}`

  return (
    <svg
      viewBox="0 0 360 520"
      role="img"
      aria-label="Acoustic guitar illustration"
      className={cn('h-auto w-full', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bodyGradient} x1="90" y1="260" x2="280" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9C784" />
          <stop offset="0.55" stopColor="#F0A04B" />
          <stop offset="1" stopColor="#C96F2E" />
        </linearGradient>
        <linearGradient id={neckGradient} x1="168" y1="100" x2="196" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5A3420" />
          <stop offset="1" stopColor="#8B5230" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#7C4DFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7C4DFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="270" rx="165" ry="230" fill={`url(#${glow})`} />

      {/* Headstock and tuning pegs */}
      <rect x="150" y="18" width="60" height="88" rx="16" fill="#281437" />
      {[38, 58, 78].map((y) => (
        <g key={y}>
          <circle cx="144" cy={y} r="4" fill="#F7B267" />
          <circle cx="216" cy={y} r="4" fill="#F7B267" />
          <line x1="151" y1={y} x2="166" y2={y} stroke="#F7B267" strokeWidth="2" opacity="0.6" />
          <line x1="194" y1={y} x2="209" y2={y} stroke="#F7B267" strokeWidth="2" opacity="0.6" />
        </g>
      ))}
      <rect x="160" y="100" width="40" height="9" rx="2" fill="#FBF5EA" opacity="0.9" />

      {/* Neck and frets */}
      <rect x="166" y="108" width="28" height="152" fill={`url(#${neckGradient})`} />
      {[128, 148, 168, 188, 208, 228, 248].map((y) => (
        <line key={y} x1="167" y1={y} x2="193" y2={y} stroke="#FBF5EA" strokeWidth="1" opacity="0.45" />
      ))}
      {[172, 178, 188].map((x) => (
        <circle key={x} cx={x} cy="216" r="1.7" fill="#FBF5EA" opacity="0.6" />
      ))}

      {/* Body */}
      <path
        d="M180 252C138 252 112 282 118 314C94 326 88 362 98 394C108 432 140 462 180 462C220 462 252 432 262 394C272 362 266 326 242 314C248 282 222 252 180 252Z"
        fill={`url(#${bodyGradient})`}
        stroke="#170D1F"
        strokeWidth="3"
      />
      <path
        d="M180 262C144 262 122 286 127 313C106 327 100 360 109 390C118 424 146 452 180 452C214 452 242 424 251 390C260 360 254 327 233 313C238 286 216 262 180 262Z"
        fill="none"
        stroke="#170D1F"
        strokeWidth="1"
        opacity="0.28"
      />

      {/* Pickguard */}
      <path
        d="M208 330C246 336 254 382 231 410C215 429 196 420 193 401C188 378 190 345 208 330Z"
        fill="#23100F"
        opacity="0.78"
      />

      {/* Soundhole and rosette */}
      <circle cx="180" cy="362" r="52" fill="none" stroke="#FBF5EA" strokeWidth="2" opacity="0.35" />
      <circle cx="180" cy="362" r="46" fill="none" stroke="#170D1F" strokeWidth="1" opacity="0.35" />
      <circle cx="180" cy="362" r="39" fill="#170D1F" />
      <circle cx="180" cy="362" r="39" fill="none" stroke="#F7B267" strokeWidth="2" opacity="0.55" />

      {/* Bridge */}
      <rect x="146" y="426" width="68" height="12" rx="3" fill="#2A1214" />
      <rect x="154" y="429" width="52" height="3" rx="1.5" fill="#FBF5EA" opacity="0.85" />

      {/* Strings */}
      <g className={strumKey > 0 ? 'is-strumming' : ''}>
        <g key={strumKey} className="guitar-strings">
          {STRING_X.map((x, index) => (
            <line
              key={x}
              x1={x}
              y1={56}
              x2={x}
              y2={432}
              stroke="#FFF9EC"
              strokeWidth={index < 2 ? 1.5 : index < 4 ? 1.15 : 0.9}
              opacity={0.82}
              strokeLinecap="round"
              style={{ '--string-index': index } as CSSProperties}
            />
          ))}
        </g>
      </g>
    </svg>
  )
}
