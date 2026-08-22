# Database — Online Quiz Maker

PostgreSQL schema and sample data for the Online Quiz Maker project.

## Files

- `schema.sql` — creates all tables, foreign keys, and indexes.
- `seed.sql` — inserts sample quizzes (JavaScript Basics, HTML & CSS,
  General Programming, Computer Science Basics) so the Quiz List page
  isn't empty on first launch.

## Order of operations (important)

Passwords must never be stored in plain text, so the demo user that
owns the sample quizzes is **not** created by a raw SQL insert. It is
created by a small script that hashes a password with `bcryptjs` at
run time. Run things in this exact order:

```powershell
# 1. Create the database (see root README for the full command)

# 2. Create tables
psql -U <db_user> -d online_quiz_maker -f database/schema.sql

# 3. Create the demo user (id = 1) with a properly bcrypt-hashed password
cd backend
node utils/seedDemoUser.js
cd ..

# 4. Insert the sample quizzes, which reference creator_id = 1
psql -U <db_user> -d online_quiz_maker -f database/seed.sql
```

The demo user's login is printed to the console when you run
`seedDemoUser.js` (email: `demo@quizmaker.com`, password: `Demo@1234`).
You can change these in `backend/utils/seedDemoUser.js` before running it.

If you skip step 3, step 4 will fail with a foreign key violation,
since `creator_id = 1` would not exist yet.
