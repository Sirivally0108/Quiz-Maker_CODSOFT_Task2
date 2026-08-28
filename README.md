# Online Quiz Maker

A full-stack web application developed for the **CodSoft Internship – Task 2**.

Online Quiz Maker allows users to register, create quizzes, browse quizzes, take quizzes, and receive automatically calculated results.

## 🚀 Live Demo

👉 **[Open Online Quiz Maker](https://quiz-maker-codsoft-task2.vercel.app)**

> The application is deployed and can be tested directly from the link above.

### Demo Login

**Email:** `demo@quizmaker.com`  
**Password:** `Demo@1234`

You can also create a new account using the Register option.

---

## 📌 Project Overview

Online Quiz Maker is a full-stack quiz platform where users can:

- Register and login securely
- Create multiple-choice quizzes
- Add questions and answer options
- Specify the correct answer
- Browse available quizzes
- Search quizzes
- Take quizzes one question at a time
- Submit answers
- Receive automatically calculated scores
- View detailed quiz results
- View previous quiz attempts from the dashboard

The quiz answers are verified and scored by the **backend**, rather than trusting the frontend.

---

## ✨ Features

### Authentication
- User registration
- User login
- JWT authentication
- Password hashing using bcryptjs
- Protected routes

### Quiz Management
- Create quizzes
- Add multiple questions
- Add multiple options
- Select the correct answer
- Edit quizzes
- Delete quizzes
- Creator-based ownership validation

### Quiz Taking
- One question at a time
- Previous/Next navigation
- Progress indicator
- Answer selection
- Submission confirmation
- Backend-verified scoring

### Results
- Score
- Percentage
- Performance message
- Question-by-question result
- Selected answer vs correct answer
- Attempt history

### User Dashboard
- Created quizzes
- Quizzes taken
- Recent attempts
- Scores

### UI
- Responsive design
- Loading states
- Error states
- Empty states
- Mobile-friendly layout

---

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- JavaScript
- React Router
- CSS

### Backend
- Node.js
- Express.js
- JavaScript
- REST API

### Database
- PostgreSQL
- `pg` PostgreSQL client

### Authentication
- JWT
- bcryptjs

### Deployment
- Vercel – Frontend
- Render – Backend
- Render PostgreSQL – Database

---

## 📂 Project Structure

```text
online-quiz-maker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
└── README.md
