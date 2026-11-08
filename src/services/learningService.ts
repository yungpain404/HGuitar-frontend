import api from '@/lib/api'
import type { Course, Lesson, LessonBlock, LessonProgressItem, Module, Locale } from '@/types'

export const learningService = {
  async getCourses(lang: Locale = 'en', guitarType?: string): Promise<Course[]> {
    const params: Record<string, string> = { lang }
    if (guitarType) params.guitarType = guitarType
    const { data } = await api.get<Course[]>('/courses', { params })
    return data
  },

  async getCourse(id: string, lang: Locale = 'en'): Promise<Course> {
    const { data } = await api.get<Course>(`/courses/${id}`, { params: { lang } })
    return data
  },

  async getModules(courseId: string, lang: Locale = 'en'): Promise<Module[]> {
    const { data } = await api.get<Module[]>(`/courses/${courseId}/modules`, { params: { lang } })
    return data
  },

  async getModule(id: string, lang: Locale = 'en'): Promise<Module> {
    const { data } = await api.get<Module>(`/modules/${id}`, { params: { lang } })
    return data
  },

  async getLessons(moduleId: string, lang: Locale = 'en'): Promise<Lesson[]> {
    const { data } = await api.get<Lesson[]>(`/modules/${moduleId}/lessons`, { params: { lang } })
    return data
  },

  async getLesson(id: string, lang: Locale = 'en'): Promise<Lesson> {
    const { data } = await api.get<Lesson>(`/lessons/${id}`, { params: { lang } })
    return data
  },

  async getBlocks(lessonId: string, lang: Locale = 'en'): Promise<LessonBlock[]> {
    const { data } = await api.get<LessonBlock[]>(`/lessons/${lessonId}/blocks`, { params: { lang } })
    return data
  },

  async completeLesson(lessonId: string, lang: Locale = 'en'): Promise<LessonProgressItem> {
    const { data } = await api.post<LessonProgressItem>(
      `/lessons/${lessonId}/complete`,
      null,
      { params: { lang } },
    )
    return data
  },
}
