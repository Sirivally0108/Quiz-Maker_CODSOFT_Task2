import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptAPI } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import '../styles/takeQuiz.css';
import '../styles/dashboard.css';

export default function QuizResults() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAttempt() {
      try {
        const data = await attemptAPI.getById(attemptId);
        if (isMounted) setAttempt(data.attempt);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAttempt();
    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (loading) return <Loading label="Loading results..." />;

  if (error) {
    return (
      <div className="take-quiz-page">
        <div className="form-error-banner">{error}</div>
        <Link to="/quizzes">← Back to quizzes</Link>
      </div>
    );
  }

  if (!attempt) return null;

  return (
    <div className="take-quiz-page">
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>{attempt.quizTitle}</h1>
        <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: '10px 0 0' }}>
          {attempt.score} / {attempt.totalQuestions}
        </p>
        <p style={{ fontSize: '1.3rem', color: 'var(--color-text-muted)' }}>
          {attempt.percentage}%
        </p>
        <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>{attempt.performanceMessage}</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
          <Link to={`/quizzes/${attempt.quizId}/take`} className="btn btn-secondary">
            Retake Quiz
          </Link>
          <Link to="/quizzes" className="btn btn-primary">
            Browse More Quizzes
          </Link>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Question Review</h2>

      {attempt.answers.map((a, index) => (
        <div key={a.questionId} className="card" style={{ marginBottom: '14px' }}>
          <p style={{ fontWeight: 700, marginBottom: '10px' }}>
            Question {index + 1}: {a.questionText}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Your answer:</strong> {a.selectedAnswer}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Correct answer:</strong> {a.correctAnswer}
          </p>
          <span className={`score-pill ${a.isCorrect ? 'good' : 'bad'}`}>
            {a.isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        </div>
      ))}
    </div>
  );
}
