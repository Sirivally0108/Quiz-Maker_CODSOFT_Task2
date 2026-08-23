import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api.js';
import '../styles/createQuiz.css';

let nextTempId = 1;
function makeTempId() {
  return `tmp-${nextTempId++}`;
}

function makeEmptyOption() {
  return { tempId: makeTempId(), option_text: '' };
}

function makeEmptyQuestion() {
  return {
    tempId: makeTempId(),
    question_text: '',
    correctTempId: null,
    options: [makeEmptyOption(), makeEmptyOption(), makeEmptyOption(), makeEmptyOption()],
  };
}

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([makeEmptyQuestion()]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateQuestionText(qIndex, text) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, question_text: text } : q))
    );
  }

  function updateOptionText(qIndex, optIndex, text) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = q.options.map((opt, j) =>
          j === optIndex ? { ...opt, option_text: text } : opt
        );
        return { ...q, options };
      })
    );
  }

  function setCorrectOption(qIndex, tempId) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctTempId: tempId } : q))
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, makeEmptyQuestion()]);
  }

  function removeQuestion(qIndex) {
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  }

  function addOption(qIndex) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, makeEmptyOption()] } : q))
    );
  }

  function removeOption(qIndex, optIndex) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const removedOption = q.options[optIndex];
        const options = q.options.filter((_, j) => j !== optIndex);
        const correctTempId =
          q.correctTempId === removedOption.tempId ? null : q.correctTempId;
        return { ...q, options, correctTempId };
      })
    );
  }

  function validateForm() {
    if (!title.trim()) return 'Please enter a quiz title.';
    if (!description.trim()) return 'Please enter a quiz description.';
    if (questions.length === 0) return 'Add at least one question.';

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const position = i + 1;

      if (!q.question_text.trim()) return `Question ${position}: please enter question text.`;
      if (q.options.length < 4) return `Question ${position}: at least 4 options are required.`;
      if (q.options.some((opt) => !opt.option_text.trim())) {
        return `Question ${position}: every option needs text.`;
      }
      if (!q.correctTempId) return `Question ${position}: select the correct option.`;
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      questions: questions.map((q) => ({
        question_text: q.question_text.trim(),
        options: q.options.map((opt) => ({
          option_text: opt.option_text.trim(),
          is_correct: opt.tempId === q.correctTempId,
        })),
      })),
    };

    setSubmitting(true);
    try {
      const data = await quizAPI.create(payload);
      navigate(`/quizzes/${data.quizId}`);
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-quiz-page">
      <h1>Create a Quiz</h1>
      <p>Add a title, description, and at least one question with 4+ options.</p>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="card">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Quiz Title</label>
            <input
              className="form-input"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. World Capitals Trivia"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className="form-textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of what this quiz covers."
            />
          </div>
        </div>

        <h2 style={{ marginTop: '30px' }}>Questions</h2>

        {questions.map((q, qIndex) => (
          <div className="question-block" key={q.tempId}>
            <div className="question-block-header">
              <h3>Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="remove-question-btn"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove question
                </button>
              )}
            </div>

            <div className="form-group">
              <input
                className="form-input"
                type="text"
                placeholder="Enter the question text"
                value={q.question_text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              />
            </div>

            <label className="form-label">Options (select the correct one)</label>
            {q.options.map((opt, optIndex) => (
              <div className="option-row" key={opt.tempId}>
                <label className="correct-radio">
                  <input
                    type="radio"
                    name={`correct-${q.tempId}`}
                    checked={q.correctTempId === opt.tempId}
                    onChange={() => setCorrectOption(qIndex, opt.tempId)}
                  />
                  Correct
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt.option_text}
                  onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                />
                {q.options.length > 4 && (
                  <button
                    type="button"
                    className="option-remove-btn"
                    aria-label="Remove option"
                    onClick={() => removeOption(qIndex, optIndex)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm add-option-btn"
              onClick={() => addOption(qIndex)}
            >
              + Add Option
            </button>
          </div>
        ))}

        <div className="question-actions">
          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <div className="publish-bar">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
