import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  const createdDate = new Date(quiz.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="quiz-card">
      <div className="quiz-card-body">
        <h3>{quiz.title}</h3>
        <p className="quiz-card-desc">{quiz.description}</p>
        <div className="quiz-card-meta">
          <span>By {quiz.creator_name}</span>
          <span>{quiz.question_count} question{quiz.question_count === 1 ? '' : 's'}</span>
          <span>{createdDate}</span>
        </div>
      </div>
      <Link to={`/quizzes/${quiz.id}`} className="btn btn-primary quiz-card-btn">
        View Quiz
      </Link>
    </div>
  );
}
