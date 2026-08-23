import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import QuizList from './pages/QuizList.jsx';
import QuizDetails from './pages/QuizDetails.jsx';
import CreateQuiz from './pages/CreateQuiz.jsx';
import TakeQuiz from './pages/TakeQuiz.jsx';
import QuizResults from './pages/QuizResults.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizDetails />} />
            <Route
              path="/create-quiz"
              element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id/take"
              element={
                <ProtectedRoute>
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-results/:attemptId"
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
