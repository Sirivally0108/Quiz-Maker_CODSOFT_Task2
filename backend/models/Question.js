const pool = require('../config/db');

const Question = {
  async create(quizId, questionText) {
    const result = await pool.query(
      `INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2)
       RETURNING id, quiz_id, question_text, created_at`,
      [quizId, questionText]
    );
    return result.rows[0];
  },

  // All questions for a quiz, each with its options. Every option's
  // is_correct flag is included here — callers decide whether it is
  // safe to expose that field (see quizController for the redaction
  // used before a quiz is taken).
  async findByQuizWithOptions(quizId) {
    const questionsResult = await pool.query(
      `SELECT id, quiz_id, question_text, created_at
       FROM questions WHERE quiz_id = $1 ORDER BY id ASC`,
      [quizId]
    );
    const questions = questionsResult.rows;

    if (questions.length === 0) return [];

    const questionIds = questions.map((q) => q.id);
    const optionsResult = await pool.query(
      `SELECT id, question_id, option_text, is_correct
       FROM options WHERE question_id = ANY($1::int[]) ORDER BY id ASC`,
      [questionIds]
    );

    const optionsByQuestion = {};
    for (const opt of optionsResult.rows) {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push(opt);
    }

    return questions.map((q) => ({
      ...q,
      options: optionsByQuestion[q.id] || [],
    }));
  },
};

module.exports = Question;
