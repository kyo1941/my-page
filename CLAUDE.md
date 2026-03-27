# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Personal portfolio site with a decoupled frontend and backend.

### Development
```
Next.js frontend (port 3000) → NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 → Ktor backend (port 8080)
                                                                                         ↓
                                                                                  MySQL db (port 3306)
```

### Production
```
Vercel (Next.js) → NEXT_PUBLIC_API_BASE_URL=https://<app>.onrender.com → Render (Ktor, port 8080)
                                                                                  ↓
                                                                          Aiven MySQL (managed)
```

- **Frontend**: Next.js 15 (TypeScript) in `frontend/`
- **Backend**: Ktor + Kotlin in `backend/`, runs on port 8080
- **Database**: MySQL 8 via Flyway migrations, using Exposed ORM
- **DI**: Koin (configured in `backend/app/src/main/kotlin/my/backend/di/AppModule.kt`)
- **Dev**: `docker-compose up` (backend + db only) → `cd frontend && pnpm dev`

## Frontend

### Commands (run from `frontend/`)
```bash
pnpm dev          # dev server with Turbopack
pnpm build        # production build
pnpm lint         # ESLint
pnpm format       # Prettier (write)
pnpm fix          # lint --fix + format
pnpm check        # lint + prettier check (CI)
```

### Layer Pattern
Pages are split into layers — each page composes sections, which delegate state to hooks, which call repositories:

```
src/app/ui/<feature>/page.tsx
  └── section/<FeatureSection>.tsx   ← presentational components
        └── hooks/<feature>/use<Feature>.ts  ← state/effects
              └── repository/<feature>Repository.ts  ← fetch calls to backend API
```

- Repositories use `NEXT_PUBLIC_API_BASE_URL` (set in `.env.local`) as the base URL
- Repository classes are exported as singletons (e.g. `export const blogRepository = new BlogRepository()`)
- Route constants live in `src/app/routes.ts`

### Admin Section
- `/admin/*` routes are protected by JWT middleware (`src/middleware.ts`)
- JWT is verified using `jose` with secret/issuer/audience from env vars (`JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`)
- Auth token stored in `auth_token` cookie

### Environment Variables (frontend)
- `NEXT_PUBLIC_API_BASE_URL` — backend base URL
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile (contact form)
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE` — must match backend

## Backend

### Commands (run from `backend/`)
```bash
./gradlew :app:run           # run locally
./gradlew :app:test          # run all tests
./gradlew :app:test --tests "my.backend.routes.BlogRoutesTest"  # single test class
./gradlew :app:ktlintCheck   # lint
./gradlew :app:ktlintFormat  # auto-fix lint
./gradlew :app:buildFatJar   # build app-all.jar
```

### Layer Pattern
```
routes/<Feature>Routes.kt     ← Ktor route definitions, injects service
  └── service/<Feature>Service.kt   ← business logic
        └── repository/<Feature>Repository.kt  ← Exposed DB queries
```

- Route functions are extension functions on `Route` (e.g. `fun Route.blogRoutes(...)`)
- All routes registered in `plugins/Routing.kt` using Koin `inject()`
- Protected endpoints use `authenticate("auth-jwt") { ... }`
- Custom exceptions are in `exception/CustomExceptions.kt`, handled by `plugins/StatusPages.kt`

### Content Storage
- Blog posts and portfolios are Markdown files in `app/src/main/resources/blogs/` and `app/src/main/resources/portfolios/`
- An `index.txt` in each directory lists the filenames to serve
- Markdown is converted to HTML server-side using flexmark

### Database
- Migrations via Flyway (`src/main/resources/db/migration/`)
- Schema: `users`, `blogs`, `tags`, `blog_tags`, `portfolios` tables
- Exposed DSL for queries; `DatabaseFactory` manages the HikariCP connection pool

### Environment / Config
- `application.yaml` (gitignored) — uses `$VAR_NAME` placeholders that Ktor substitutes from environment variables at runtime
- Required env vars: `DB_DRIVER`, `DB_USER`, `DB_PASSWORD`, `DB_MAX_POOL_SIZE`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`
