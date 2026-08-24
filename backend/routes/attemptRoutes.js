const express = require('express');
const router = express.Router();
const {
  submitAttempt,
  getMyAttempts,
  getAttemptById,
} = require('../controllers/attemptController');
const authMiddleware = require('../middleware/authMiddleware');

// IMPORTANT: '/my' must be registered before '/:id' or Express will try
// to match "my" as an :id parameter.
router.post('/', authMiddleware, submitAttempt);
router.get('/my', authMiddleware, getMyAttempts);
router.get('/:id', authMiddleware, getAttemptById);

module.exports = router;
