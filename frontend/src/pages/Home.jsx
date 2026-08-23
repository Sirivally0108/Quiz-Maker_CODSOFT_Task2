import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { quizAPI } from '../services/api.js';
import QuizCard from '../components/QuizCard.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import '../styles/home.css';

export default function Home() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadQuizzes() {
      try {
        const data = await quizAPI.getAll();
        if (isMounted) setQuizzes(data.quizzes.slice(0, 3));
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadQuizzes();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Create, Share, and Take Quizzes</h1>
        <p>
          Online Quiz Maker lets you build multiple-choice quizzes in minutes and
          challenge others to test their knowledge — with instant, accurate results.
        </p>
        <div className="hero-actions">
          <Link to={user ? '/create-quiz' : '/register'} className="btn btn-primary">
            Create a Quiz
          </Link>
          <Link to="/quizzes" className="btn btn-secondary">
            Take a Quiz
          </Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2>Featured Quizzes</h2>
          <Link to="/quizzes">Browse all →</Link>
        </div>

        {loading && <Loading label="Loading quizzes..." />}

        {!loading && error && (
          <div className="form-error-banner">{error}</div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <EmptyState
            title="No quizzes yet"
            message="Be the first to create a quiz for others to try."
            actionLabel="Create a Quiz"
            onAction={() => (window.location.href = user ? '/create-quiz' : '/register')}
          />
        )}

        {!loading && !error && quizzes.length > 0 && (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
