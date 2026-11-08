import api from '@/lib/api'
import type { Quiz, QuizAttempt } from '@/types'

export const quizService = {
  async getQuizForLesson(lessonId: string, lang = 'en'): Promise<Quiz> {
    const { data } = await api.get<Quiz>(`/lessons/${lessonId}/quiz`, { params: { lang } })
    return data
  },

  async startAttempt(quizId: string): Promise<QuizAttempt> {
    const { data } = await api.post<QuizAttempt>(`/quizzes/${quizId}/attempts`)
    return data
  },

  async submitAttempt(
    attemptId: string,
    answers: { questionId: string; selectedAnswerId: string }[],
  ): Promise<QuizAttempt> {
    const { data } = await api.post<QuizAttempt>(`/quiz-attempts/${attemptId}/submit`, { answers })
    return data
  },

  async getAttempt(attemptId: string): Promise<QuizAttempt> {
    const { data } = await api.get<QuizAttempt>(`/quiz-attempts/${attemptId}`)
    return data
  },
}
