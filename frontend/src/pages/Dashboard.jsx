import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { quizAPI, attemptAPI } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const [myQuizzes, setMyQuizzes] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [quizzesData, attemptsData] = await Promise.all([
          quizAPI.getAll(),
          attemptAPI.getMine(),
        ]);

        if (!isMounted) return;

        const created = quizzesData.quizzes.filter((q) => q.creator_id === user.id);
        setMyQuizzes(created);
        setMyAttempts(attemptsData.attempts);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  if (loading) return <Loading label="Loading dashboard..." />;

  const totalAttempts = myAttempts.length;
  const averagePercentage =
    totalAttempts > 0
      ? Math.round(
          (myAttempts.reduce((sum, a) => sum + Number(a.percentage), 0) / totalAttempts) * 10
        ) / 10
      : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Here's an overview of your quiz activity.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/create-quiz" className="btn btn-primary">Create Quiz</Link>
          <Link to="/quizzes" className="btn btn-secondary">Browse Quizzes</Link>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{myQuizzes.length}</div>
          <div className="stat-label">Quizzes Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalAttempts}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averagePercentage}%</div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Your Created Quizzes</h2>
        {myQuizzes.length === 0 ? (
          <EmptyState
            title="No quizzes created yet"
            message="Create your first quiz to share with others."
            actionLabel="Create Quiz"
            onAction={() => (window.location.href = '/create-quiz')}
          />
        ) : (
          myQuizzes.map((quiz) => (
            <div className="list-card" key={quiz.id}>
              <div>
                <div className="list-card-title">{quiz.title}</div>
                <div className="list-card-sub">
                  {quiz.question_count} question{quiz.question_count === 1 ? '' : 's'}
                </div>
              </div>
              <div className="list-card-actions">
                <Link to={`/quizzes/${quiz.id}`} className="btn btn-secondary btn-sm">
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Results</h2>
        {myAttempts.length === 0 ? (
          <EmptyState
            title="No attempts yet"
            message="Take a quiz to see your results here."
            actionLabel="Browse Quizzes"
            onAction={() => (window.location.href = '/quizzes')}
          />
        ) : (
          myAttempts.map((attempt) => (
            <div className="list-card" key={attempt.id}>
              <div>
                <div className="list-card-title">{attempt.quiz_title}</div>
                <div className="list-card-sub">
                  {new Date(attempt.completed_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <span className={`score-pill ${Number(attempt.percentage) >= 60 ? 'good' : 'bad'}`}>
                {attempt.score}/{attempt.total_questions} ({Number(attempt.percentage)}%)
              </span>
              <div className="list-card-actions">
                <Link to={`/quiz-results/${attempt.id}`} className="btn btn-secondary btn-sm">
                  View Result
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
