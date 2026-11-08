import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  children: ReactNode
  variant?: 'default' | 'success' | 'muted' | 'amber' | 'outline'
}

export function Badge({ children, variant = 'default' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
        variant === 'default' && 'bg-grape-100 text-grape-700',
        variant === 'success' && 'bg-sage-100 text-sage-600',
        variant === 'muted' && 'bg-ink/5 text-ink/60',
        variant === 'amber' && 'bg-amber-300/40 text-amber-600',
        variant === 'outline' && 'border border-ink/15 text-ink/60',
      )}
    >
      {children}
    </span>
  )
}
