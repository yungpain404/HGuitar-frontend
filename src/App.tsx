import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { HomePage } from '@/features/home/HomePage'

const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
)
const OnboardingPage = lazy(() =>
  import('@/features/onboarding/OnboardingPage').then((module) => ({
    default: module.OnboardingPage,
  })),
)
const CoursesPage = lazy(() =>
  import('@/features/learning/CoursesPage').then((module) => ({ default: module.CoursesPage })),
)
const CourseDetailPage = lazy(() =>
  import('@/features/learning/CourseDetailPage').then((module) => ({
    default: module.CourseDetailPage,
  })),
)
const ModulePage = lazy(() =>
  import('@/features/learning/ModulePage').then((module) => ({ default: module.ModulePage })),
)
const LessonPage = lazy(() =>
  import('@/features/learning/LessonPage').then((module) => ({ default: module.LessonPage })),
)
const ChordsPage = lazy(() =>
  import('@/features/chords/ChordsPage').then((module) => ({ default: module.ChordsPage })),
)
const StrummingPatternsPage = lazy(() =>
  import('@/features/strumming/StrummingPatternsPage').then((module) => ({ default: module.StrummingPatternsPage })),
)
const StrummingPatternDetailPage = lazy(() =>
  import('@/features/strumming/StrummingPatternDetailPage').then((module) => ({ default: module.StrummingPatternDetailPage })),
)
const SongsPage = lazy(() =>
  import('@/features/song/SongsPage').then((module) => ({ default: module.SongsPage })),
)
const SongDetailPage = lazy(() =>
  import('@/features/song/SongDetailPage').then((module) => ({ default: module.SongDetailPage })),
)
const LearningMethodsPage = lazy(() =>
  import('@/features/learning/LearningMethodsPage').then((module) => ({ default: module.LearningMethodsPage })),
)
const ProgressPage = lazy(() =>
  import('@/features/progress/ProgressPage').then((module) => ({ default: module.ProgressPage })),
)
const NotFoundPage = lazy(() =>
  import('@/features/not-found/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="onboarding"
          element={
            <RequireAuth>
              <OnboardingPage />
            </RequireAuth>
          }
        />

        <Route path="learn">
          <Route index element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="modules/:moduleId" element={<ModulePage />} />
          <Route path="lessons/:lessonId" element={<LessonPage />} />
        </Route>

        <Route path="chords" element={<ChordsPage />} />
        <Route path="strumming-patterns" element={<StrummingPatternsPage />} />
        <Route
          path="strumming-patterns/:id"
          element={<StrummingPatternDetailPage />}
        />
        <Route path="songs" element={<SongsPage />} />
        <Route path="songs/:id" element={<SongDetailPage />} />
        <Route path="learning-methods" element={<LearningMethodsPage />} />
        <Route
          path="progress"
          element={
            <RequireAuth>
              <ProgressPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
