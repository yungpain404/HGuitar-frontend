import { cn } from '@/lib/cn'

interface Props {
  className?: string
}

/**
 * HGuitar logo: a full acoustic-style guitar (headstock, neck, body),
 * tilted like it's being held. Strictly two brand colours — purple (#6D28D9) and white.
 * Background stays upright; only the guitar inside rotates.
 */
export function GuitarMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="HGuitar"
      className={cn('h-9 w-9', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upright purple background (not rotated) */}
      <rect width="48" height="48" rx="14" fill="#6D28D9" />

      <g transform="rotate(-20 24 24)">
        {/* Headstock */}
        <rect x="19" y="3" width="10" height="6" rx="2" fill="#FFFFFF" />

        {/* Neck / fretboard */}
        <rect x="21" y="9" width="6" height="14" rx="1.5" fill="#FFFFFF" />

        {/* Frets */}
        {[12, 15, 18].map((y) => (
          <line
            key={y}
            x1="21"
            y1={y}
            x2="27"
            y2={y}
            stroke="#6D28D9"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}

        {/* Body */}
        <ellipse cx="24" cy="31" rx="9" ry="7" fill="#FFFFFF" />

        {/* Soundhole */}
        <circle cx="24" cy="31" r="2.5" fill="none" stroke="#6D28D9" strokeWidth="1.2" />
      </g>
    </svg>
  )
}
