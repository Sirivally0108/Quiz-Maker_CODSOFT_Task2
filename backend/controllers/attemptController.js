const pool = require('../config/db');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

function buildPerformanceMessage(percentage) {
  if (percentage === 100) return 'Perfect score! Outstanding work!';
  if (percentage >= 80) return 'Great job!';
  if (percentage >= 60) return 'Good effort, keep practicing!';
  if (percentage >= 40) return 'Not bad — a little more review will help.';
  return 'Keep practicing, you will improve!';
}

// POST /api/attempts
// The backend is the sole source of truth for scoring: it fetches the real
// questions/options from PostgreSQL and compares them against what the
// client submitted. The frontend's own idea of the score is never trusted.
async function submitAttempt(req, res) {
  try {
    const { quiz_id, answers } = req.body;

    if (!quiz_id || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'quiz_id and answers are required.' });
    }

    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Pull every question for this quiz along with its options (including
    // is_correct) directly from the database — never from the request body.
    const questionsResult = await pool.query(
      `SELECT id, question_text FROM questions WHERE quiz_id = $1 ORDER BY id ASC`,
      [quiz_id]
    );
    const questions = questionsResult.rows;

    if (questions.length === 0) {
      return res.status(400).json({ message: 'This quiz has no questions.' });
    }

    const questionIds = questions.map((q) => q.id);
    const optionsResult = await pool.query(
      `SELECT id, question_id, option_text, is_correct
       FROM options WHERE question_id = ANY($1::int[])`,
      [questionIds]
    );

    const optionsByQuestion = {};
    for (const opt of optionsResult.rows) {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push(opt);
    }

    const answersByQuestionId = {};
    for (const a of answers) {
      answersByQuestionId[a.question_id] = a.selected_option_id;
    }

    let score = 0;
    const gradedAnswers = [];

    for (const question of questions) {
      const options = optionsByQuestion[question.id] || [];
      const correctOption = options.find((opt) => opt.is_correct === true);
      const selectedOptionId = answersByQuestionId[question.id] || null;
      const isCorrect =
        selectedOptionId != null && correctOption != null && selectedOptionId === correctOption.id;

      if (isCorrect) score += 1;

      gradedAnswers.push({
        questionId: question.id,
        selectedOptionId,
        correctOptionId: correctOption ? correctOption.id : null,
        isCorrect,
      });
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 10000) / 100;

    const attempt = await Attempt.create({
      quizId: quiz_id,
      userId: req.userId,
      score,
      totalQuestions,
      percentage,
    });

    for (const ga of gradedAnswers) {
      await Attempt.addAnswer({
        attemptId: attempt.id,
        questionId: ga.questionId,
        selectedOptionId: ga.selectedOptionId,
        correctOptionId: ga.correctOptionId,
        isCorrect: ga.isCorrect,
      });
    }

    return res.status(201).json({
      message: 'Quiz submitted successfully.',
      attemptId: attempt.id,
      score,
      totalQuestions,
      percentage,
      performanceMessage: buildPerformanceMessage(percentage),
    });
  } catch (err) {
    console.error('Submit attempt error:', err.message);
    return res.status(500).json({ message: 'Failed to submit quiz. Please try again.' });
  }
}

// GET /api/attempts/my
async function getMyAttempts(req, res) {
  try {
    const attempts = await Attempt.findByUser(req.userId);
    return res.status(200).json({ attempts });
  } catch (err) {
    console.error('Get my attempts error:', err.message);
    return res.status(500).json({ message: 'Failed to load attempt history.' });
  }
}

// GET /api/attempts/:id
// Users may only view their own attempts.
async function getAttemptById(req, res) {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findDetailedById(id);

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found.' });
    }
    if (attempt.user_id !== req.userId) {
      return res.status(403).json({ message: 'You can only view your own attempts.' });
    }

    return res.status(200).json({
      attempt: {
        id: attempt.id,
        quizId: attempt.quiz_id,
        quizTitle: attempt.quiz_title,
        score: attempt.score,
        totalQuestions: attempt.total_questions,
        percentage: Number(attempt.percentage),
        performanceMessage: buildPerformanceMessage(Number(attempt.percentage)),
        completedAt: attempt.completed_at,
        answers: attempt.answers.map((a) => ({
          questionId: a.question_id,
          questionText: a.question_text,
          selectedAnswer: a.selected_option_text || 'No answer selected',
          correctAnswer: a.correct_option_text,
          isCorrect: a.is_correct,
        })),
      },
    });
  } catch (err) {
    console.error('Get attempt by id error:', err.message);
    return res.status(500).json({ message: 'Failed to load result.' });
  }
}

module.exports = { submitAttempt, getMyAttempts, getAttemptById };
