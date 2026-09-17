# Quiz Builder

A small full-stack app for building quizzes. Create a quiz from true/false, short answer and
multiple-choice questions, browse everything you have made, open any quiz to see its structure,
and delete the ones you no longer need.

- **Backend** — Node.js, Express, TypeScript, Prisma, SQLite (PostgreSQL ready)
- **Frontend** — Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod

## Requirements

- Node.js 18.18 or newer (Node 20+ recommended)
- npm 9+

## Quick start

```bash
# 1. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init   # creates prisma/dev.db and applies the schema
npm run db:seed                      # optional: adds a sample quiz
npm run dev                          # API on http://localhost:4000

# 2. Frontend (new terminal, from the repo root)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                          # app on http://localhost:3000
```

Open <http://localhost:3000>. The app redirects to `/quizzes`.

From the repo root you can also run both together:

```bash
npm install          # installs concurrently
npm run install:all
npm run dev
```

## Database setup

The project uses **SQLite** by default so it runs with no external service.
`DATABASE_URL="file:./dev.db"` in `backend/.env` points Prisma at `backend/prisma/dev.db`.

`npx prisma migrate dev` creates the database file, applies the migration and generates the
Prisma client. Useful follow-ups:

| Command                 | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `npm run prisma:studio` | Opens Prisma Studio to inspect the data          |
| `npm run db:seed`       | Inserts the "JavaScript basics" sample quiz      |
| `npx prisma migrate reset` | Drops the database, re-applies migrations, re-seeds |

### Using PostgreSQL instead

1. In `backend/prisma/schema.prisma`, change the datasource provider to `postgresql`.
2. Set `DATABASE_URL="postgresql://user:password@localhost:5432/quiz_builder?schema=public"`
   in `backend/.env`.
3. Delete `backend/prisma/migrations` (if present) and run `npx prisma migrate dev --name init` again.

No other code changes are needed — the schema uses no SQLite-specific features.

## Environment variables

`backend/.env` (copy from `.env.example`, never committed):

| Variable       | Default                 | Purpose                             |
| -------------- | ----------------------- | ----------------------------------- |
| `DATABASE_URL` | `file:./dev.db`         | Prisma connection string            |
| `PORT`         | `4000`                  | Port the API listens on             |
| `CORS_ORIGIN`  | `http://localhost:3000` | Comma-separated allowed origins     |

`frontend/.env.local` (copy from `.env.local.example`):

| Variable              | Default                 | Purpose                    |
| --------------------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the API        |

The backend validates its environment with Zod on boot and exits with a readable message if
anything is missing.

## Creating a sample quiz

**In the UI:** go to `/create`, give the quiz a title, then add questions. Pick an answer format
per question — True or false, Short answer, or Multiple choice — add or remove questions and
options as you go, and press **Save quiz**. You land on the new quiz's detail page.

**With the seed script:** `npm run db:seed` from `backend/` inserts a three-question quiz that
covers all three question types.

**With curl:**

```bash
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HTTP basics",
    "questions": [
      { "type": "BOOLEAN", "text": "HTTP is stateless.", "correctAnswer": true },
      { "type": "INPUT", "text": "Which status code means Not Found?", "correctAnswer": "404" },
      {
        "type": "CHECKBOX",
        "text": "Which methods are idempotent?",
        "options": [
          { "text": "GET", "isCorrect": true },
          { "text": "PUT", "isCorrect": true },
          { "text": "POST", "isCorrect": false }
        ]
      }
    ]
  }'
```

## API

Base URL: `http://localhost:4000`

| Method   | Route          | Response                                                  |
| -------- | -------------- | --------------------------------------------------------- |
| `POST`   | `/quizzes`     | `201` with the created quiz                                |
| `GET`    | `/quizzes`     | `200` with `[{ id, title, questionCount, createdAt }]`      |
| `GET`    | `/quizzes/:id` | `200` with the quiz and all its questions, `404` if unknown |
| `DELETE` | `/quizzes/:id` | `204`, `404` if unknown                                     |
| `GET`    | `/health`      | `200` liveness probe                                        |

Invalid payloads return `422` with the flattened Zod issues, so the client can surface them
field by field.

### Question shapes

```jsonc
// POST body
{ "type": "BOOLEAN",  "text": "…", "correctAnswer": true }
{ "type": "INPUT",    "text": "…", "correctAnswer": "const" }
{ "type": "CHECKBOX", "text": "…", "options": [{ "text": "…", "isCorrect": true }] }
```

Questions and options keep their authoring order through a `position` column, and deleting a
quiz cascades to both.

## Scripts

Run inside `backend/` or `frontend/`:

| Script                 | Backend                          | Frontend                     |
| ---------------------- | -------------------------------- | ---------------------------- |
| `npm run dev`          | tsx watch server                 | Next dev server              |
| `npm run build`        | `tsc` to `dist/`                 | `next build`                 |
| `npm start`            | runs `dist/index.js`             | `next start`                 |
| `npm run lint`         | ESLint                           | ESLint (Next config)         |
| `npm run format`       | Prettier write                   | Prettier write               |
| `npm run typecheck`    | `tsc --noEmit`                   | `tsc --noEmit`               |

ESLint and Prettier are configured in both packages (`eslint-config-prettier` keeps them from
fighting), and all files are formatted.

## Project structure

```
quiz-builder/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Quiz → Question → Option models
│   │   └── seed.ts              # sample quiz
│   └── src/
│       ├── config/env.ts        # Zod-validated environment
│       ├── middleware/          # async wrapper, error + 404 handlers
│       ├── modules/quizzes/     # schema, service, controller, routes, DTO mapper
│       ├── app.ts               # Express app wiring
│       └── index.ts             # server bootstrap
├── frontend/
│   └── src/
│       ├── app/                 # /, /create, /quizzes, /quizzes/[id]
│       ├── components/          # form, list, detail, question rendering
│       ├── lib/quiz-form.ts     # Zod form schema + payload mapping
│       ├── services/api.ts      # typed API client
│       └── types/quiz.ts        # shared domain types
└── README.md
```

## Notes on the implementation

- **Validation lives in one place per side.** The API parses every request body with Zod
  discriminated unions, so a `CHECKBOX` question cannot be saved without at least two options
  and one correct answer. The form mirrors those rules with its own schema for instant feedback.
- **The form is fully dynamic.** `useFieldArray` drives questions and the nested options list;
  changing a question's answer format swaps the fields and resets the parts that no longer apply.
- **Detail pages are read-only by design** — inputs are rendered disabled so the structure and
  the marked answers are visible without being answerable.
- **Responsive and accessible basics**: single-column layout that works from 320px up, labelled
  controls, visible focus rings, `aria-current` navigation, and reduced-motion support.
