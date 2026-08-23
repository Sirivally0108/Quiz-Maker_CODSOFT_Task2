import React from 'react';

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelect,
}) {
  return (
    <div className="question-card">
      <p className="question-progress">
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2 className="question-text">{question.question_text}</h2>

      <div className="option-list">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option-item ${selectedOptionId === option.id ? 'selected' : ''}`}
            onClick={() => onSelect(question.id, option.id)}
          >
            <span className="option-radio" />
            <span>{option.option_text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
