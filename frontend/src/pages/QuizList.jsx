import React, { useEffect, useState } from 'react';
import { quizAPI } from '../services/api.js';
import QuizCard from '../components/QuizCard.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import '../styles/quizzes.css';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    async function loadQuizzes() {
      try {
        const data = await quizAPI.getAll(activeSearch);
        if (isMounted) setQuizzes(data.quizzes);
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
  }, [activeSearch]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  }

  return (
    <div className="quizzes-page container">
      <div className="quizzes-header">
        <h1>Browse Quizzes</h1>
        <p>Find a quiz to test your knowledge.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="Search quizzes by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading && <Loading label="Loading quizzes..." />}

      {!loading && error && <div className="form-error-banner">{error}</div>}

      {!loading && !error && quizzes.length === 0 && (
        <EmptyState
          title="No quizzes found"
          message={activeSearch ? `No results for "${activeSearch}".` : 'No quizzes are available yet.'}
        />
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
