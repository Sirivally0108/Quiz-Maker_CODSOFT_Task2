require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Central error handler — never leak stack traces or DB details to clients.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
