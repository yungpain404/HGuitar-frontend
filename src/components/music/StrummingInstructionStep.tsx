import type { StrummingInstruction } from '@/types'

interface Props {
  step: StrummingInstruction
}

export function StrummingInstructionStep({ step }: Props) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border border-ink/10 bg-cream-50 p-4',
      )}
    >
      <span
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-grape-100 text-grape-700 font-bold text-sm"
      >
        {step.stepNumber}
      </span>

      <div className="flex flex-col gap-1.5">
        <h3
          className="font-display text-lg font-semibold text-ink"
          id={`step-${step.stepNumber}`}
        >
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed text-ink/60">{step.content}</p>
        {step.tip && (
          <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs text-amber-700">
            <span className="shrink-0 mt-0.5">💡</span>
            <span className="leading-relaxed">{step.tip}</span>
          </div>
        )}
      </div>
    </div>
  )
}
