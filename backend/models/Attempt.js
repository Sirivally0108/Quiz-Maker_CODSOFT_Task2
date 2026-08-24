const pool = require('../config/db');

const Attempt = {
  async create({ quizId, userId, score, totalQuestions, percentage }) {
    const result = await pool.query(
      `INSERT INTO quiz_attempts (quiz_id, user_id, score, total_questions, percentage)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, quiz_id, user_id, score, total_questions, percentage, completed_at`,
      [quizId, userId, score, totalQuestions, percentage]
    );
    return result.rows[0];
  },

  async addAnswer({ attemptId, questionId, selectedOptionId, correctOptionId, isCorrect }) {
    await pool.query(
      `INSERT INTO attempt_answers
         (attempt_id, question_id, selected_option_id, correct_option_id, is_correct)
       VALUES ($1, $2, $3, $4, $5)`,
      [attemptId, questionId, selectedOptionId, correctOptionId, isCorrect]
    );
  },

  async findById(id) {
    const result = await pool.query(`SELECT * FROM quiz_attempts WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async findByUser(userId) {
    const result = await pool.query(
      `SELECT
         a.id, a.quiz_id, a.score, a.total_questions, a.percentage, a.completed_at,
         q.title AS quiz_title
       FROM quiz_attempts a
       JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.user_id = $1
       ORDER BY a.completed_at DESC`,
      [userId]
    );
    return result.rows;
  },

  // Full detail for a single attempt: the questions, the user's selected
  // option, and the correct option — used to render the Results page.
  async findDetailedById(attemptId) {
    const attemptResult = await pool.query(
      `SELECT a.*, q.title AS quiz_title
       FROM quiz_attempts a
       JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.id = $1`,
      [attemptId]
    );
    const attempt = attemptResult.rows[0];
    if (!attempt) return null;

    const answersResult = await pool.query(
      `SELECT
         aa.question_id,
         qs.question_text,
         aa.selected_option_id,
         selopt.option_text AS selected_option_text,
         aa.correct_option_id,
         corropt.option_text AS correct_option_text,
         aa.is_correct
       FROM attempt_answers aa
       JOIN questions qs ON qs.id = aa.question_id
       LEFT JOIN options selopt ON selopt.id = aa.selected_option_id
       LEFT JOIN options corropt ON corropt.id = aa.correct_option_id
       WHERE aa.attempt_id = $1
       ORDER BY aa.id ASC`,
      [attemptId]
    );

    return { ...attempt, answers: answersResult.rows };
  },
};

module.exports = Attempt;
