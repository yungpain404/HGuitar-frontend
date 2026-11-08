import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
          {label}
        </label>
      )}
      <input
        id={id}
        {...rest}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-2xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm text-ink placeholder:text-ink/30 transition focus:border-grape-500 focus:outline-none focus:ring-4 focus:ring-grape-500/10',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
          className,
        )}
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
