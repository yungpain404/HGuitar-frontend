import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { useLocale } from '@/hooks/useLocale'
import { quizService } from '@/services/quizService'
import type { QuizAttempt } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

interface Props {
  lessonId: string
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export function QuizPanel({ lessonId }: Props) {
  const { t } = useTranslation()
  const lang = useLocale()
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const { data: quiz, isLoading, isError } = useQuery({
    queryKey: ['lesson-quiz', lessonId, lang],
    queryFn: () => quizService.getQuizForLesson(lessonId, lang),
    retry: false,
  })

  const startMutation = useMutation({
    mutationFn: (quizId: string) => quizService.startAttempt(quizId),
    onSuccess: (result) => {
      setAttempt(result)
      setAnswers({})
    },
  })

  const submitMutation = useMutation({
    mutationFn: (payload: {
      attemptId: string
      answers: { questionId: string; selectedAnswerId: string }[]
    }) => quizService.submitAttempt(payload.attemptId, payload.answers),
    onSuccess: (result) => setAttempt(result),
  })

  if (isLoading) {
    return <p className="text-sm text-ink/55">{t('common.loading')}</p>
  }

  // A lesson without a quiz returns 404; the lesson page simply omits this section.
  if (isError || !quiz) return null

  const questions = quiz.questions
  const answeredCount = questions.filter((question) => Boolean(answers[question.id])).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  const isSubmitted = attempt?.status === 'SUBMITTED'
  const correctCount = attempt?.answers.filter((answer) => answer.correct).length ?? 0
  const score = attempt?.score != null ? Math.round(attempt.score) : 0

  return (
    <section
      aria-labelledby="quiz-heading"
      className="rounded-[2rem] border border-ink/10 bg-cream-50 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{t('quiz.eyebrow')}</p>
          <h2 id="quiz-heading" className="mt-2 font-display text-2xl font-semibold text-ink">
            {quiz.title || t('quiz.title')}
          </h2>
        </div>
        {attempt && <Badge variant="muted">{t('quiz.attempt', { n: attempt.attemptNumber })}</Badge>}
      </div>

      {!isLoggedIn && (
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-ink/55">{t('quiz.loginToTake')}</p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
          >
            {t('nav.login')}
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      )}

      {isLoggedIn && !attempt && (
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-ink/55">
            {questions.length === 0
              ? t('quiz.noQuestions')
              : t('quiz.intro', { n: questions.length })}
          </p>
          <Button
            className="mt-4"
            disabled={questions.length === 0}
            loading={startMutation.isPending}
            onClick={() => startMutation.mutate(quiz.id)}
          >
            {startMutation.isPending ? t('quiz.starting') : t('quiz.start')}
            <span aria-hidden="true">→</span>
          </Button>
          {startMutation.isError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {t('quiz.startError')}
            </p>
          )}
        </div>
      )}

      {isLoggedIn && attempt && !isSubmitted && (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 text-xs text-ink/60">
            <span>{t('quiz.answeredProgress', { answered: answeredCount, total: questions.length })}</span>
            <span>{Math.round((answeredCount / Math.max(questions.length, 1)) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-grape-600 transition-all duration-300"
              style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }}
            />
          </div>

          <div className="mt-6 flex flex-col gap-7">
            {questions.map((question, questionIndex) => (
              <fieldset key={question.id}>
                <legend className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-grape-100 text-xs font-bold text-grape-700">
                    {questionIndex + 1}
                  </span>
                  <span className="pt-0.5 text-sm font-medium leading-relaxed text-ink">
                    {question.text}
                  </span>
                </legend>

                <div className="mt-3 flex flex-col gap-2 pl-10">
                  {question.answers.map((answer, answerIndex) => {
                    const checked = answers[question.id] === answer.id
                    return (
                      <label
                        key={answer.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-2xl border px-3.5 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-grape-500 has-[:focus-visible]:ring-offset-2',
                          checked
                            ? 'border-grape-500 bg-grape-50 ring-2 ring-grape-500/10'
                            : 'border-ink/10 bg-cream-50 hover:border-ink/25',
                        )}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={answer.id}
                          checked={checked}
                          onChange={() =>
                            setAnswers((current) => ({ ...current, [question.id]: answer.id }))
                          }
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                            checked
                              ? 'border-grape-600 bg-grape-600 text-cream-50'
                              : 'border-ink/15 text-ink/60',
                          )}
                        >
                          {LETTERS[answerIndex] ?? answerIndex + 1}
                        </span>
                        <span className="pt-0.5 text-sm leading-relaxed text-ink/75">{answer.text}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              disabled={!allAnswered}
              loading={submitMutation.isPending}
              onClick={() => {
                submitMutation.mutate({
                  attemptId: attempt.id,
                  answers: questions.map((question) => ({
                    questionId: question.id,
                    selectedAnswerId: answers[question.id],
                  })),
                })
              }}
            >
              {submitMutation.isPending ? t('quiz.submitting') : t('quiz.submit')}
            </Button>
            {!allAnswered && <span className="text-xs text-ink/55">{t('quiz.answerAll')}</span>}
          </div>

          {submitMutation.isError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {t('quiz.submitError')}
            </p>
          )}
        </div>
      )}

      {isLoggedIn && attempt && isSubmitted && (
        <div className="mt-5">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-plum-800 px-6 py-6 text-cream-100">
            <div className="stage-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative flex items-end gap-4">
              <p className="font-display text-5xl font-semibold leading-none text-cream-50">{score}%</p>
              <p className="pb-1 text-sm text-cream-200/60">
                {t('quiz.scoreSummary', { correct: correctCount, total: questions.length })}
              </p>
            </div>
            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <h3 className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            {t('quiz.review')}
          </h3>

          <ol className="mt-3 flex flex-col divide-y divide-ink/10">
            {questions.map((question, questionIndex) => {
              const result = attempt.answers.find((answer) => answer.questionId === question.id)
              const selected = question.answers.find((answer) => answer.id === result?.selectedAnswerId)
              const status = !result ? 'unanswered' : result.correct ? 'correct' : 'incorrect'

              return (
                <li key={question.id} className="flex flex-col gap-2 py-4">
                  <p className="text-sm font-medium leading-relaxed text-ink">
                    {t('quiz.question', { n: questionIndex + 1 })}. {question.text}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                        status === 'correct' && 'bg-sage-100 text-sage-600',
                        status === 'incorrect' && 'bg-red-50 text-red-600',
                        status === 'unanswered' && 'bg-ink/5 text-ink/60',
                      )}
                    >
                      {status === 'correct' && t('quiz.correctAnswer')}
                      {status === 'incorrect' && t('quiz.incorrectAnswer')}
                      {status === 'unanswered' && t('quiz.notAnswered')}
                    </span>
                    <span className="text-ink/55">{selected ? selected.text : t('quiz.noSelection')}</span>
                  </div>
                </li>
              )
            })}
          </ol>

          <Button
            className="mt-5"
            variant="outline"
            size="sm"
            loading={startMutation.isPending}
            onClick={() => startMutation.mutate(quiz.id)}
          >
            {startMutation.isPending ? t('quiz.starting') : t('quiz.tryAgain')}
          </Button>
          {startMutation.isError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {t('quiz.startError')}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
