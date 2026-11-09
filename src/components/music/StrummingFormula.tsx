import { cn } from '@/lib/cn'

/**
 * Render công thức đánh (ví dụ: "↓ ↓↑↑ ↓ ↑") thành các cụm ký hiệu.
 * Mỗi ký hiệu được tô màu riêng để người mới dễ nhận biết:
 *   ↓ = gảy xuống (grape)
 *   ↑ = gảy lên (sage)
 *   - = nghỉ (muted)
 */
interface Props {
  formula: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SYMBOL_COLOR: Record<string, string> = {
  '↓': 'text-grape-600',
  '↑': 'text-sage-600',
  '-': 'text-ink/40',
}

const SYMBOL_SIZE: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function StrummingFormula({
  formula,
  className,
  size = 'md',
}: Props) {
  if (!formula) return null

  // Tách thành các cụm (cách nhau bởi khoảng trắng), mỗi cụm là 1 nhịp.
  const groups = formula.trim().split(/\s+/)

  return (
    <div
      role="img"
      aria-label={formula}
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5',
        className,
      )}
    >
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-0.5">
          {group.split('').map((symbol, index) => {
            const color = SYMBOL_COLOR[symbol] ?? 'text-ink/60'
            const isLast = index === group.length - 1
            return (
              <span
                key={index}
                aria-label={
                  symbol === '↓' ? 'gãy xuống' : symbol === '↑' ? 'gãy lên' : 'nghỉ'
                }
                className={cn(
                  'font-display font-semibold select-none',
                  SYMBOL_SIZE[size],
                  color,
                  isLast ? 'mr-0.5' : 'mr-0',
                )}
              >
                {symbol}
              </span>
            )
          })}
          {/* Khoảng trắng nhỏ giữa các cụm nếu không phải cụm cuối */}
          {groupIndex < groups.length - 1 && <span className="px-1" />}
        </div>
      ))}
    </div>
  )
}
