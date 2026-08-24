# Online Quiz Maker

A full-stack web application where users can register, create multiple-choice
quizzes, browse and search quizzes made by others, take them one question at
a time, and get an instantly scored, backend-verified result. Built for the
CodSoft internship (Task 2).

## Description

Online Quiz Maker lets any registered user build a quiz (title, description,
and any number of questions, each with 4+ options and exactly one correct
answer), publish it, and share it with others. Anyone logged in can browse
the quiz library, search by keyword, and take a quiz through a clean
one-question-at-a-time flow with a progress bar. When a quiz is submitted,
the **backend** — never the browser — fetches the real questions and correct
answers from PostgreSQL, grades the attempt, stores it, and returns the
score. Results show exactly which questions were right or wrong, alongside
the user's answer and the correct one. A dashboard summarizes quizzes
created, quizzes taken, and recent scores.

## Features

- Email/password registration and login with JWT authentication
- Passwords hashed with bcryptjs; hashes are never returned by the API
- Create quizzes with multiple questions, each with 4+ options and one
  correct answer, validated on both frontend and backend
- Only the quiz's creator can edit or delete it (enforced server-side)
- Quiz listing with keyword search
- Quiz details page that never leaks correct answers before submission
- One-question-at-a-time quiz-taking UI with progress bar, Previous/Next,
  and a confirmation prompt before submitting with unanswered questions
- Server-side scoring — the frontend's own tally is never trusted
- Immediate results page: score, percentage, performance message, and a
  question-by-question breakdown of selected vs. correct answers
- Personal dashboard: quizzes created, quizzes taken, and attempt history
- Loading, error, and empty states throughout
- Fully responsive layout for desktop, tablet, and mobile

## Technologies

- **Frontend:** React, Vite, JavaScript, React Router, CSS
- **Backend:** Node.js, Express.js, JavaScript
- **Database:** PostgreSQL (via the `pg` package)
- **Auth:** JWT (`jsonwebtoken`), `bcryptjs`
- **API:** REST

## Project Structure

```text
online-quiz-maker/
├── frontend/           React + Vite single-page app
│   └── src/
│       ├── components/ Reusable UI pieces (Navbar, QuizCard, etc.)
│       ├── pages/       One file per route
│       ├── context/      AuthContext (login state, token storage)
│       ├── services/    api.js — the single place all HTTP calls live
│       └── styles/       One CSS file per page/area
├── backend/            Express REST API
│   ├── config/          PostgreSQL connection (db.js)
│   ├── controllers/     Request handlers / business logic
│   ├── middleware/      JWT auth middleware
│   ├── models/          Thin SQL query functions, one file per table group
│   ├── routes/          Express routers, one file per resource
│   └── utils/            seedDemoUser.js — creates the demo user safely
└── database/
    ├── schema.sql        Table definitions
    └── seed.sql           Sample quizzes
```

## Requirements

- Node.js 18+ and npm
- PostgreSQL 13+ running locally (or reachable via network)
- Git (optional, for version control)

## Setup

All commands below are written for **PowerShell** on Windows, per the
project requirements. The equivalent commands work in bash/zsh with `$env:VAR`
replaced by `export VAR` where relevant.

### 1. Clone the repository

```powershell
git clone <your-repo-url> online-quiz-maker
cd online-quiz-maker
```

(If you received this project as a folder rather than a Git repo, just
`cd` into it.)

### 2. Install backend dependencies

```powershell
cd backend
npm install
```

### 3. Install frontend dependencies

```powershell
cd ../frontend
npm install
cd ..
```

### 4. Create the PostgreSQL database

Open `psql` (or your preferred PostgreSQL client) and run:

```sql
CREATE DATABASE online_quiz_maker;
```

### 5. Configure environment variables

```powershell
cd backend
copy .env.example .env
```

Edit `backend/.env` and fill in your real PostgreSQL credentials and a
JWT secret (any long random string — for example, generate one with
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=online_quiz_maker
DB_USER=postgres
DB_PASSWORD=your_real_password
JWT_SECRET=paste_a_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Then set up the frontend env file:

```powershell
cd ../frontend
copy .env.example .env
cd ..
```

`frontend/.env` only needs:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Run the database schema

```powershell
psql -U postgres -d online_quiz_maker -f database/schema.sql
```

### 7. Create the demo user, then seed sample quizzes

Passwords are never stored in plain text, so the demo user that owns the
sample quizzes is created by a small script that hashes a real password
with bcryptjs — not by a raw SQL insert.

```powershell
cd backend
node utils/seedDemoUser.js
cd ..
```

This prints a login (`demo@quizmaker.com` / `Demo@1234` by default — you
can change these in `backend/utils/seedDemoUser.js` before running it).
Now run the seed data, which attaches sample quizzes to that user:

```powershell
psql -U postgres -d online_quiz_maker -f database/seed.sql
```

### 8. Start the backend

In one terminal:

```powershell
cd backend
npm run dev
```

You should see `PostgreSQL connected successfully.` and
`Server running on http://localhost:5000`.

### 9. Start the frontend

In a **second** terminal:

```powershell
cd frontend
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## API Endpoints

| Method | Endpoint              | Auth | Description                          |
|--------|------------------------|------|---------------------------------------|
| POST   | `/api/users/register`  | No   | Create an account                     |
| POST   | `/api/users/login`     | No   | Log in, get a JWT                     |
| GET    | `/api/users/me`        | Yes  | Get the logged-in user's profile      |
| POST   | `/api/quizzes`         | Yes  | Create a quiz with questions/options  |
| GET    | `/api/quizzes`         | No   | List quizzes (`?search=` supported)   |
| GET    | `/api/quizzes/:id`     | No   | Quiz detail (no correct answers)      |
| PUT    | `/api/quizzes/:id`     | Yes  | Edit a quiz you own                   |
| DELETE | `/api/quizzes/:id`     | Yes  | Delete a quiz you own                 |
| POST   | `/api/attempts`        | Yes  | Submit answers, get a graded result   |
| GET    | `/api/attempts/my`     | Yes  | Your attempt history                  |
| GET    | `/api/attempts/:id`    | Yes  | Full detail of one of your attempts   |

## Running the Project (quick reference)

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## Testing Flow

1. Register a new account
2. Login
3. Open Dashboard
4. Create Quiz
5. Add 4+ options per question
6. Select the correct answer for each question
7. Publish
8. Open Quiz List
9. Search for your quiz
10. Open Quiz Details
11. Take the quiz
12. Submit
13. Confirm the score shown matches what the backend calculated (try
    intentionally getting one wrong to verify it's graded correctly)
14. Verify the Results page shows your answers vs. correct answers
15. Verify the attempt appears in your Dashboard
16. Logout
17. Login with a second account (register a new one)
18. Take the quiz created by the first user
19. Verify results are correct and independent of the first user's attempt

## Known Limitations

- **JWT storage:** the token is stored in `localStorage` for simplicity,
  which is appropriate for local development but not the most XSS-resistant
  approach for a production deployment (an httpOnly cookie would be a
  common next step).
- **Quiz editing** is limited to title/description via the API; editing
  existing questions/options after publishing is out of scope, matching the
  "don't over-engineer" guidance for this internship task. Deleting a quiz
  removes its questions, options, and attempts via cascading foreign keys.
- **No password reset / email verification** — out of scope for this task.
- **No pagination** on the quiz list — acceptable at the sample-data scale
  of this project; would be a natural addition for a larger dataset.
- **No rate limiting** on login/register — acceptable for a local/internship
  project, not something to expose publicly as-is.
- This is an internship-level project and, while it follows solid security
  practices (hashed passwords, JWT auth, ownership checks, parameterized
  SQL), it should not be described as fully production-hardened.

## Assumption Made

The spec required "confirm password validation" on registration but didn't
specify a minimum password length. This project enforces a 6-character
minimum on both frontend and backend as a reasonable, simple baseline.
