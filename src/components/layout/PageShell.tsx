import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  children: ReactNode
  narrow?: boolean
  className?: string
}

/** Centered content container used across pages */
export function PageShell({ children, narrow = false, className }: Props) {
  return (
    <main
      className={cn(
        'mx-auto w-full px-5 py-10 sm:px-8 sm:py-14',
        narrow ? 'max-w-2xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </main>
  )
}
