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
export type GuitarDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type ChordCategory = 'MAJOR' | 'MINOR' | 'DOMINANT_7' | 'MAJOR_7' | 'MINOR_7' | 'SUSPENDED'

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
  category: ChordCategory
  description: string
  positions: ChordPosition[]
}

// ── Strumming patterns ────────────────────────────────────────────────────────
export type StrummingDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type StrummingGuitarType = 'ACOUSTIC' | 'CLASSICAL' | 'ALL'

export interface StrummingInstruction {
  id: string
  stepNumber: number
  title: string
  content: string
  tip: string | null
}

export interface StrummingPattern {
  id: string
  name: string
  formula: string
  description: string
  difficulty: StrummingDifficulty
  guitarType: StrummingGuitarType
  bpmMin: number | null
  bpmMax: number | null
  isFormula: boolean
  status: PublicationStatus
  sortOrder: number
  createdAt: string
}

export interface StrummingPatternDetail extends StrummingPattern {
  instructions: StrummingInstruction[]
}

// ── Songs ─────────────────────────────────────────────────────────────────────
export type SongSource = 'VIETNAMESE' | 'FOREIGN'

export interface SongChord {
  id: string
  chordId: string
  chordName: string
  sortOrder: number
  isRequired: boolean
}

export interface SongSection {
  id: string
  sectionType: 'INTRO' | 'VERSE' | 'CHORUS' | 'BRIDGE' | 'OUTRO'
  sectionOrder: number
  name: string | null
  chordProgression: string
  strummingPatternId: string | null
}

export interface Song {
  id: string
  guitarType: GuitarType
  difficulty: GuitarDifficulty
  source: SongSource
  originalKey: string | null
  capoFret: number
  bpm: number | null
  strummingPatternId: string | null
  isFormula: boolean
  status: PublicationStatus
  sortOrder: number
  createdAt: string
  title: string
  artist: string
  description: string | null
  chords: SongChord[]
  sections: SongSection[]
}

// ── Learning methods ──────────────────────────────────────────────────────────
export type LearningMethodGuitar = 'ACOUSTIC' | 'CLASSICAL' | 'ALL'

export interface LearningMethod {
  id: string
  nameKey: string
  difficulty: GuitarDifficulty
  targetGuitar: LearningMethodGuitar
  estimatedWeeks: number
  stepsCount: number
  status: PublicationStatus
  sortOrder: number
  createdAt: string
  title: string
  description: string
  steps: string[]
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
