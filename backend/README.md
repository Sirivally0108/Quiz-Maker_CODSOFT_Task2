# Online Quiz Maker — Backend

Express + PostgreSQL REST API. See the root `README.md` for full setup
instructions. Quick reference:

```powershell
npm install
npm run dev      # starts with nodemon (auto-restart)
npm start        # starts without nodemon
```

Copy `.env.example` to `.env` and fill in your database credentials and a
JWT secret before starting the server.

## Endpoints

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me` (auth required)
- `POST /api/quizzes` (auth required)
- `GET /api/quizzes?search=...`
- `GET /api/quizzes/:id`
- `PUT /api/quizzes/:id` (auth required, owner only)
- `DELETE /api/quizzes/:id` (auth required, owner only)
- `POST /api/attempts` (auth required)
- `GET /api/attempts/my` (auth required)
- `GET /api/attempts/:id` (auth required, owner only)
