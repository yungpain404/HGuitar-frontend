import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'ghost' | 'outline' | 'inverse'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape-500 focus-visible:ring-offset-2',
        loading ? 'cursor-progress opacity-100' : 'disabled:cursor-not-allowed disabled:opacity-40',
        {
          'bg-grape-600 text-cream-50 shadow-soft hover:bg-grape-700 hover:shadow-card':
            variant === 'primary',
          'bg-ink text-cream-50 hover:bg-plum-800': variant === 'secondary',
          'bg-amber-400 text-ink shadow-soft hover:bg-amber-300': variant === 'amber',
          'text-ink/65 hover:bg-ink/5 hover:text-ink': variant === 'ghost',
          'border border-ink/15 bg-transparent text-ink hover:border-ink hover:bg-cream-50':
            variant === 'outline',
          'border border-white/25 bg-transparent text-cream-50 hover:border-cream-50 hover:bg-white/5':
            variant === 'inverse',
        },
        {
          'px-3.5 py-2 text-xs': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-7 py-3.5 text-base': size === 'lg',
        },
        className,
      )}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  )
}
