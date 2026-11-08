# HGuitar Frontend

Bilingual (English / Vietnamese) web client for the **HGuitar** beginner guitar learning platform — built to help absolute beginners learn acoustic and classical guitar from zero, with no prior music theory required.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **React Router**, **TanStack Query**, **React Hook Form**, **Zod**, and **i18next**.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing & Navigation](#routing--navigation)
- [API & Authentication](#api--authentication)
- [Google Sign-In (Firebase)](#google-sign-in-firebase)
- [Localization (i18n)](#localization-i18n)
- [Design System](#design-system)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

HGuitar is a bilingual (Vietnamese `vi` / English `en`) guitar-learning web application for absolute beginners. The frontend is a single-page application that consumes a Spring Boot REST API (Microsoft SQL Server backend) and provides:

- Structured beginner courses, modules, and lessons
- Chord library with interactive diagrams
- Lesson completion tracking and quiz attempts
- Progress dashboard
- Onboarding flow for new students
- Google sign-in via Firebase Authentication

The client never stores plaintext passwords or tokens. Authorization is enforced by the backend; hiding UI elements is never treated as a security control.

## Features

| Area | Capability |
|------|------------|
| **Home** | Landing page with hero instrument, guitar paths (Acoustic / Classical), how-it-works steps, chord teaser, and final CTA. Smooth scroll-snap navigation between sections. |
| **Courses** | Browse available courses and filter by guitar type. |
| **Course / Module / Lesson** | View lesson content, images, duration, and completion status. Mark lessons complete. |
| **Chords** | Open chord library with SVG chord diagrams and finger placement. |
| **Quiz** | Start attempts, submit answers, and receive feedback. |
| **Progress** | Track lesson completion and learning progress (authenticated students). |
| **Auth** | Register, login, Google sign-in (Firebase), logout, and session refresh. |
| **Onboarding** | Guided setup for new students after sign-in. |
| **Internationalization** | UI strings in English and Vietnamese, persisted language preference, fallback to English. |
| **Performance** | Route-based code splitting (`React.lazy`), TanStack Query caching (`staleTime: 30s`), scroll-snap on home page, `prefers-reduced-motion` support. |

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19 |
| Language | TypeScript | ~7 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS | 3.4 |
| Routing | React Router DOM | 7 |
| Data fetching | TanStack Query | 5 |
| Forms | React Hook Form + Zod | 7 / 4 |
| i18n | i18next + react-i18next | 26 / 17 |
| Auth | Firebase Authentication | 13 |
| HTTP client | Axios | 1 |
| Linter | Oxlint | 1 |

## Requirements

- **Node.js 20+**
- **Backend API** running at `http://localhost:8080` (configurable via `VITE_API_PROXY_TARGET`)

The dev server runs on **http://localhost:5500** and proxies `/api` to the backend.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment example and fill in values
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

Open **http://localhost:5500** in your browser. The API proxy forwards `/api/**` to `http://localhost:8080` by default (see `vite.config.ts`).

If the backend runs on a different port:

```powershell
# PowerShell
$env:VITE_API_PROXY_TARGET = 'http://localhost:8081'
npm run dev
```

```bash
# macOS / Linux
VITE_API_PROXY_TARGET='http://localhost:8081' npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and populate the Firebase web app configuration:

```env
# Firebase web app configuration for Google sign-in.
# Obtain values from Firebase Console → Project settings → Your apps → Web app.
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=

# Optional: override the API proxy target (default: http://localhost:8080)
VITE_API_PROXY_TARGET=http://localhost:8080
```

> **Never commit real values.** `.env.local` is local-only and must not be tracked. Only `.env.example` with placeholders is committed.

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with API proxy on port 5500 |
| `npm run build` | Type-check (`tsc -b`) and build production bundle |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
src/
├── App.tsx           # Route table (lazy-loaded routes + Suspense)
├── main.tsx          # Providers: QueryClient, AuthProvider, BrowserRouter
├── index.css         # Global styles, Tailwind layers, design tokens
├── components/
│   ├── auth/         # GoogleSignInButton, RequireAuth
│   ├── brand/        # GuitarMark, GuitarTypeIcon
│   ├── layout/       # AppLayout, Navbar, MobileTabBar, RouteLoading, GlobalLoadingIndicator
│   ├── learning/     # LessonContent
│   ├── music/        # ChordDiagram
│   └── ui/           # Button, Spinner, LoadingState, Input, Badge, cn helper
├── context/
│   ├── auth-context.ts
│   └── AuthContext.tsx
├── features/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── chords/       # ChordsPage
│   ├── home/         # HomePage, HeroInstrument
│   ├── learning/     # CoursesPage, CourseDetailPage, ModulePage, LessonPage, QuizPanel
│   ├── not-found/    # NotFoundPage
│   ├── onboarding/   # OnboardingPage
│   └── progress/     # ProgressPage
├── hooks/            # useDocumentTitle, useLocale
├── i18n/             # index.ts, en.ts, vi.ts (UI translations)
├── lib/              # api.ts, cn.ts, firebase.ts, firebaseConfig.ts, openChords.ts, session.ts
├── services/         # authService, chordService, learningService, progressService, quizService, userService
└── types/            # index.ts (API response and payload types)
```

## Routing & Navigation

Routes are defined in `App.tsx` and wrapped in `AppLayout`. Public routes (`/`, `/login`, `/register`) are chromeless; authenticated routes render the navbar, footer, and mobile tab bar.

```text
/                         HomePage (public)
/login                    LoginPage (public)
/register                 RegisterPage (public)
/onboarding               RequireAuth → OnboardingPage
/learn                    CoursesPage
/learn/courses/:id        CourseDetailPage
/learn/modules/:moduleId  ModulePage
/learn/lessons/:lessonId  LessonPage
/chords                   ChordsPage
/progress                 RequireAuth → ProgressPage
*                         NotFoundPage
```

Route chunks are lazy-loaded with `React.lazy` and fall back to `RouteLoading` via `Suspense`. In-flight queries/mutations show `GlobalLoadingIndicator` (fade overlay, 500 ms transition).

## API & Authentication

- All requests use the `/api/v1` base path through the Axios client in `src/lib/api.ts`.
- The access token is attached automatically. On a single `401`, one refresh-token request is attempted; if refresh fails, the local session is cleared and the user is redirected to `/login`.
- Learning content (`/learn/**` and `/chords`) is readable by guests. Marking a lesson complete, taking quizzes, viewing progress, and onboarding require a signed-in **STUDENT**.
- Expected roles: `STUDENT`, `CONTENT_EDITOR`, `ADMIN`. Authorization is enforced by the backend; the frontend never relies on button visibility alone.

## Google Sign-In (Firebase)

Login and registration support Google OAuth through Firebase Authentication:

1. Create a Firebase project and add a **Web app**.
2. Enable **Authentication → Sign-in method → Google**.
3. Add `localhost` and `127.0.0.1` to **Authentication → Settings → Authorized domains** (plus the production domain later).
4. Copy `.env.example` to `.env.local` and fill in the Firebase web config (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`).
5. Set the same project ID on the backend as `FIREBASE_PROJECT_ID` and restart it.

The browser obtains a Firebase ID token; the backend verifies it against Google's public certificates and issues the application JWT via `POST /api/v1/auth/google` with `{ "idToken": "..." }`.

If the frontend Firebase config is missing, the Google button shows a configuration message instead of starting the popup. No Firebase service account or private key is required by the backend.

## Localization (i18n)

- UI strings live in `src/i18n/en.ts` and `src/i18n/vi.ts`. Keep both files in sync when adding keys.
- Learning content is localized by the API; the client sends `lang=vi|en` based on the active UI language.
- The selected language is persisted in `localStorage` and falls back to `en`.
- Use stable language codes (`vi`, `en`) as identifiers; avoid hardcoding user-facing text in components.

## Design System

- **Stage and paper:** dark aubergine “stage” sections alternate with warm cream reading surfaces. Purple is the primary action colour; amber is the accent for practice and momentum.
- **Typography:** Lora for editorial display headings and Be Vietnam Pro for UI and body text. Both are loaded from Google Fonts with system fallbacks.
- **Guitar motifs:** six-line “string” backgrounds, fret dots, original SVG guitar illustrations, and chord diagrams form the visual identity.
- **Motion:** Home page uses CSS scroll-snap (`scroll-snap-type-y-mandatory`) so each section snaps into view. All motion respects `prefers-reduced-motion`.
- **Tokens:** colours, fonts, radii, and shadows live in `tailwind.config.js`. Shared UI primitives are in `src/components/ui`; brand artwork is in `src/components/brand`.

## Accessibility

- Semantic HTML and ARIA roles (`role="status"`, `aria-live="polite"`, `aria-hidden`).
- Visible focus states with `focus-visible:ring-2 ring-grape-500`.
- Keyboard-accessible interactions; no reliance on colour alone to convey state.
- `scroll-behavior: smooth` with `auto` fallback under `prefers-reduced-motion`.
- Animations and transitions disabled when `prefers-reduced-motion: reduce` is set.

## Testing

Before declaring a change complete:

```bash
npm run lint      # Oxlint
npm run build     # Type-check + production build
```

Prioritize tests for registration/authentication, course and lesson retrieval, lesson completion, chord information, quiz attempts and submissions, progress tracking, authorization/ownership, and Vietnamese/English localization.

## Git Workflow

All commit messages must be in English and follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional-scope>): <short imperative description>
```

Supported types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

- `feat(auth): add Google sign-in via Firebase`
- `feat(home): add scroll-snap sections to landing page`
- `fix(loading): set page transition duration to 500ms`
- `fix(i18n): correct English lesson translations`
- `refactor(learning): separate lesson business logic`
- `test(quiz): add quiz submission tests`
- `docs: update project setup guide`
- `chore(deps): update frontend dependencies`

Before committing, inspect `git status`, `git diff`, and `git diff --cached`. Stage specific files rather than blindly running `git add .`.

## Deployment

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Serve the `dist/` directory behind a reverse proxy (Nginx, Cloudflare, etc.) that forwards `/api/**` to the Spring Boot API.

3. Ensure the production domain is added to Firebase **Authorized domains** for Google sign-in.

4. Set Firebase environment variables on the hosting platform (never commit real values).

## Security

- Never store secrets in source code, migration scripts, Docker Compose files, documentation, screenshots, or commit messages.
- `.env` files with real values must not be committed. Use `.env.example` with placeholders.
- Authentication and authorization are enforced by the backend; the client relies on the backend for security decisions.
- Access tokens and refresh tokens are never logged.

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow the architecture guidelines in `AGENTS.md` (layered backend, feature-organized frontend).
3. Keep changes small, focused, and maintainable. Do not introduce new dependencies without a clear reason.
4. Run lint, type-check, and build before opening a pull request.
5. Ensure both English and Vietnamese localization are preserved/updated.

## License

This project is private and intended for the HGuitar platform. All rights reserved.

---

**Repository:** `D:\HGuitar\frontend`  
**Backend:** Spring Boot + Microsoft SQL Server (see sibling backend module)