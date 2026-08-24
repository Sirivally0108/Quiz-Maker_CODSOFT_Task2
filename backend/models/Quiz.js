const pool = require('../config/db');

const Quiz = {
  async create({ title, description, creatorId }) {
    const result = await pool.query(
      `INSERT INTO quizzes (title, description, creator_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, creator_id, created_at`,
      [title, description, creatorId]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(`SELECT * FROM quizzes WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  // Returns quizzes with creator name and question count, optionally
  // filtered by a case-insensitive search on title or description.
  async findAll(search) {
    const params = [];
    let whereClause = '';

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      whereClause = `WHERE q.title ILIKE $1 OR q.description ILIKE $1`;
    }

    const result = await pool.query(
      `SELECT
         q.id,
         q.title,
         q.description,
         q.creator_id,
         q.created_at,
         u.name AS creator_name,
         COUNT(qs.id)::int AS question_count
       FROM quizzes q
       JOIN users u ON u.id = q.creator_id
       LEFT JOIN questions qs ON qs.quiz_id = q.id
       ${whereClause}
       GROUP BY q.id, u.name
       ORDER BY q.created_at DESC`,
      params
    );
    return result.rows;
  },

  async findByCreator(creatorId) {
    const result = await pool.query(
      `SELECT
         q.id,
         q.title,
         q.description,
         q.created_at,
         COUNT(qs.id)::int AS question_count
       FROM quizzes q
       LEFT JOIN questions qs ON qs.quiz_id = q.id
       WHERE q.creator_id = $1
       GROUP BY q.id
       ORDER BY q.created_at DESC`,
      [creatorId]
    );
    return result.rows;
  },

  async update(id, { title, description }) {
    const result = await pool.query(
      `UPDATE quizzes SET title = $1, description = $2 WHERE id = $3
       RETURNING id, title, description, creator_id, created_at`,
      [title, description, id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    await pool.query(`DELETE FROM quizzes WHERE id = $1`, [id]);
  },
};

module.exports = Quiz;
