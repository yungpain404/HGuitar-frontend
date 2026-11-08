// ── Shared ────────────────────────────────────────────────────────────────────
export type Locale = 'en' | 'vi'

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  userId: string
  email: string
  displayName: string
  roles: string[]
  accessToken: string
  refreshToken: string
}

export interface RegisterPayload {
  email: string
  password: string
  displayName: string
}

export interface LoginPayload {
  email: string
  password: string
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface UserProfile {
  userId: string
  email: string
  displayName: string
  avatarUrl: string | null
}

// ── Onboarding ────────────────────────────────────────────────────────────────
export type GuitarType = 'ACOUSTIC' | 'CLASSICAL'

export interface OnboardingStatus {
  completed: boolean
  guitarType: GuitarType | null
}

// ── Learning ──────────────────────────────────────────────────────────────────
export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Course {
  id: string
  guitarType: GuitarType
  sortOrder: number
  status: PublicationStatus
  title: string
  description: string
}

export interface Module {
  id: string
  courseId: string
  sortOrder: number
  status: PublicationStatus
  title: string
  description: string | null
}

export interface Lesson {
  id: string
  moduleId: string
  sortOrder: number
  durationMinutes: number
  status: PublicationStatus
  title: string
  description: string
}

// ── Content ───────────────────────────────────────────────────────────────────
export type BlockType =
  | 'TEXT'
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'CHORD_DIAGRAM'
  | 'PRACTICE_INSTRUCTION'

export interface LessonBlock {
  id: string
  lessonId: string
  blockType: BlockType
  sortOrder: number
  mediaAssetId: string | null
  metadataJson: string | null
  content: string
}

// ── Music ─────────────────────────────────────────────────────────────────────
export interface ChordPosition {
  id: string
  positionNumber: number
  baseFret: number
  fingersJson: string
}

export interface Chord {
  id: string
  name: string
  guitarType: GuitarType
  description: string
  positions: ChordPosition[]
}

// ── Assessment ────────────────────────────────────────────────────────────────
export interface AnswerOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  sortOrder: number
  text: string
  answers: AnswerOption[]
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: QuizQuestion[]
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED'

export interface AttemptAnswerResult {
  questionId: string
  selectedAnswerId: string
  correct: boolean
}

export interface QuizAttempt {
  id: string
  quizId: string
  attemptNumber: number
  status: AttemptStatus
  startedAt: string
  submittedAt: string | null
  score: number | null
  answers: AttemptAnswerResult[]
}

// ── Progress ──────────────────────────────────────────────────────────────────
export type LessonProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface LessonProgressItem {
  lessonId: string
  title: string
  status: LessonProgressStatus
  completedAt: string | null
}

export interface UserProgress {
  totalLessonsCompleted: number
  lessons: LessonProgressItem[]
}
