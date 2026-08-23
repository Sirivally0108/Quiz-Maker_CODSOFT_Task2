import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api.js';
import QuestionCard from '../components/QuestionCard.jsx';
import Loading from '../components/Loading.jsx';
import '../styles/takeQuiz.css';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: selected_option_id }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  if (loading) return <Loading label="Loading quiz..." />;

  if (error) {
    return (
      <div className="take-quiz-page">
        <div className="form-error-banner">{error}</div>
        <Link to="/quizzes">← Back to quizzes</Link>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="take-quiz-page">
        <div className="form-error-banner">This quiz has no questions to take.</div>
        <Link to="/quizzes">← Back to quizzes</Link>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  function handleSelect(questionId, optionId) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function goPrevious() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
  }

  async function handleSubmit() {
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        quiz_id: quiz.id,
        answers: quiz.questions.map((q) => ({
          question_id: q.id,
          selected_option_id: answers[q.id] || null,
        })),
      };
      const data = await attemptAPI.submit(payload);
      navigate(`/quiz-results/${data.attemptId}`);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="take-quiz-page">
      <h1 className="take-quiz-title">{quiz.title}</h1>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {submitError && <div className="form-error-banner">{submitError}</div>}

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        selectedOptionId={answers[currentQuestion.id] || null}
        onSelect={handleSelect}
      />

      <div className="take-quiz-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
