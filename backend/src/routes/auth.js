// Authentication routes
const express = require('express');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const teacher = await Teacher.findByEmail(email);
    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await Teacher.verifyPassword(password, teacher.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.email,
        role: teacher.role,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
      },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: teacher.id,
        email: teacher.email,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        role: teacher.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
router.get('/me', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(teacher);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
