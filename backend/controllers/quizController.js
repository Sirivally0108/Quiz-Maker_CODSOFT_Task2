const pool = require('../config/db');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Validates the shape of a quiz submission before touching the database.
// Returns an error message string, or null if the payload is valid.
function validateQuizPayload({ title, description, questions }) {
  if (!title || !title.trim()) return 'Title is required.';
  if (!description || !description.trim()) return 'Description is required.';
  if (!Array.isArray(questions) || questions.length === 0) {
    return 'At least one question is required.';
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const position = i + 1;

    if (!q.question_text || !q.question_text.trim()) {
      return `Question ${position}: question text is required.`;
    }
    if (!Array.isArray(q.options) || q.options.length < 4) {
      return `Question ${position}: at least 4 options are required.`;
    }
    for (const opt of q.options) {
      if (!opt.option_text || !opt.option_text.trim()) {
        return `Question ${position}: every option must have text.`;
      }
    }

    const correctCount = q.options.filter((opt) => opt.is_correct === true).length;
    if (correctCount !== 1) {
      return `Question ${position}: exactly one option must be marked correct.`;
    }
  }

  return null;
}

// POST /api/quizzes
async function createQuiz(req, res) {
  const client = await pool.connect();
  try {
    const { title, description, questions } = req.body;

    const validationError = validateQuizPayload({ title, description, questions });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await client.query('BEGIN');

    const quizResult = await client.query(
      `INSERT INTO quizzes (title, description, creator_id) VALUES ($1, $2, $3) RETURNING id`,
      [title.trim(), description.trim(), req.userId]
    );
    const quizId = quizResult.rows[0].id;

    for (const q of questions) {
      const questionResult = await client.query(
        `INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2) RETURNING id`,
        [quizId, q.question_text.trim()]
      );
      const questionId = questionResult.rows[0].id;

      for (const opt of q.options) {
        await client.query(
          `INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)`,
          [questionId, opt.option_text.trim(), opt.is_correct === true]
        );
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({ message: 'Quiz created successfully.', quizId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create quiz error:', err.message);
    return res.status(500).json({ message: 'Failed to create quiz. Please try again.' });
  } finally {
    client.release();
  }
}

// GET /api/quizzes?search=...
async function getQuizzes(req, res) {
  try {
    const { search } = req.query;
    const quizzes = await Quiz.findAll(search);
    return res.status(200).json({ quizzes });
  } catch (err) {
    console.error('Get quizzes error:', err.message);
    return res.status(500).json({ message: 'Failed to load quizzes.' });
  }
}

// GET /api/quizzes/:id
// Returns quiz details with questions/options, but strips is_correct so
// the correct answer is never sent to the client before submission.
async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const creator = await pool.query(`SELECT name FROM users WHERE id = $1`, [quiz.creator_id]);
    const questions = await Question.findByQuizWithOptions(id);

    const safeQuestions = questions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options.map((opt) => ({
        id: opt.id,
        option_text: opt.option_text,
      })),
    }));

    return res.status(200).json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        creator_name: creator.rows[0]?.name || 'Unknown',
        created_at: quiz.created_at,
        question_count: safeQuestions.length,
        questions: safeQuestions,
      },
    });
  } catch (err) {
    console.error('Get quiz by id error:', err.message);
    return res.status(500).json({ message: 'Failed to load quiz.' });
  }
}

// PUT /api/quizzes/:id
// Only title/description are editable here to keep the update path simple
// and safe; changing questions/options is out of scope for this project.
async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    if (quiz.creator_id !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own quizzes.' });
    }
    if (!title || !title.trim() || !description || !description.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const updated = await Quiz.update(id, { title: title.trim(), description: description.trim() });
    return res.status(200).json({ message: 'Quiz updated successfully.', quiz: updated });
  } catch (err) {
    console.error('Update quiz error:', err.message);
    return res.status(500).json({ message: 'Failed to update quiz.' });
  }
}

// DELETE /api/quizzes/:id
async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    if (quiz.creator_id !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own quizzes.' });
    }

    await Quiz.delete(id);
    return res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (err) {
    console.error('Delete quiz error:', err.message);
    return res.status(500).json({ message: 'Failed to delete quiz.' });
  }
}

module.exports = { createQuiz, getQuizzes, getQuizById, updateQuiz, deleteQuiz };
