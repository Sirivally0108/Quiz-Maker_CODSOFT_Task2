import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { quizAPI } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import '../styles/quizzes.css';

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadQuiz() {
      try {
        const data = await quizAPI.getById(id);
        if (isMounted) setQuiz(data.quiz);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleStart() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/quizzes/${id}/take`);
  }

  if (loading) return <Loading label="Loading quiz..." />;
  if (error) {
    return (
      <div className="quiz-details-page">
        <div className="form-error-banner">{error}</div>
        <Link to="/quizzes">← Back to quizzes</Link>
      </div>
    );
  }
  if (!quiz) return null;

  const createdDate = new Date(quiz.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="quiz-details-page">
      <div className="card quiz-details-card">
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>

        <div className="quiz-details-meta">
          <span>By {quiz.creator_name}</span>
          <span>{quiz.question_count} question{quiz.question_count === 1 ? '' : 's'}</span>
          <span>Created {createdDate}</span>
        </div>

        <button className="btn btn-primary" onClick={handleStart}>
          {user ? 'Start Quiz' : 'Login to Start Quiz'}
        </button>
      </div>
    </div>
  );
}
