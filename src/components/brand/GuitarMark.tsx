import { cn } from '@/lib/cn'

interface Props {
  className?: string
}

/**
 * HGuitar logo: a guitar neck and headstock, tilted like a guitar being held.
 * Strictly two brand colours — purple (#6D28D9) and white.
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
      <rect width="48" height="48" rx="14" fill="#6D28D9" />

      <g transform="rotate(-13 24 24)">
        {/* Headstock, separated from the neck by a purple gap */}
        <rect x="13" y="2" width="22" height="8" rx="3" fill="#FFFFFF" />

        {/* Neck / fretboard */}
        <rect x="18" y="12.5" width="12" height="27" rx="3" fill="#FFFFFF" />

        {/* Nut */}
        <line x1="18" y1="13.5" x2="30" y2="13.5" stroke="#6D28D9" strokeWidth="1.8" />

        {/* Frets */}
        {[19, 25, 31].map((y) => (
          <line key={y} x1="18" y1={y} x2="30" y2={y} stroke="#6D28D9" strokeWidth="1.7" />
        ))}
      </g>
    </svg>
  )
}