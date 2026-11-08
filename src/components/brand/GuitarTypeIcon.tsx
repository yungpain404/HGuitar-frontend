import { cn } from '@/lib/cn'
import type { GuitarType } from '@/types'

interface Props {
  type: GuitarType
  className?: string
}

/** Minimal line icon that distinguishes acoustic and classical guitars. */
export function GuitarTypeIcon({ type, className }: Props) {
  const isClassical = type === 'CLASSICAL'

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={cn('h-12 w-12', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32 32c-8.5 0-14 5-14 12 0 7.5 6 12 14 12s14-4.5 14-12c0-7-5.5-12-14-12Z" />
      <circle cx="32" cy="44" r="4" />
      <rect x="29" y="12" width="6" height="21" rx="1.5" />
      <rect x="26" y="4" width="12" height="9" rx="2.5" />
      <path d="M25 51h14" />
      <path d="M29 8v43M32 8v43M35 8v43" strokeWidth="1" opacity="0.75" />

      {isClassical ? (
        <path d="M29 7v3M32 7v3M35 7v3" />
      ) : (
        <>
          <path d="M22 6h-3M45 6h-3" />
          <path d="M39 41c4 1 5 6 3 9-1.5 2.4-4 1.8-4.8 0-1-2-1-6-1-9Z" fill="currentColor" stroke="none" opacity="0.35" />
        </>
      )}
    </svg>
  )
}
