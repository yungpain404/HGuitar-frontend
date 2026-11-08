import { cn } from '@/lib/cn'

interface Props {
  label?: string
  className?: string
}

export function Spinner({ label, className }: Props) {
  return (
    <span
      role="status"
      aria-label={label ?? 'Loading'}
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-grape-200 border-t-grape-600',
        className,
      )}
    />
  )
}
