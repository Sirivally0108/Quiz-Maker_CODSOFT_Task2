const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/users/register
async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await User.findByEmail(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

// POST /api/users/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

// GET /api/users/me
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('Get current user error:', err.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

module.exports = { register, login, getCurrentUser };
