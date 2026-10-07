// Class routes
const express = require('express');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { verifyToken, requireTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get classes for the current user: admins see every class, teachers their own,
// other roles (parents) none yet
router.get('/', verifyToken, async (req, res) => {
  try {
    let classes = [];
    if (req.user.role === 'admin') {
      classes = await Class.getAll();
    } else if (req.user.role === 'teacher') {
      classes = await Class.getByTeacher(req.user.id);
    }

    // Add stats for each class
    const classesWithStats = await Promise.all(
      classes.map(async (cls) => {
        const stats = await Class.getStatsToday(cls.id);
        return {
          ...cls,
          stats,
        };
      })
    );

    res.json(classesWithStats);
  } catch (err) {
    console.error('Get classes error:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get class details with students
router.get('/:classId', verifyToken, requireTeacherOrAdmin, async (req, res) => {
  const { classId } = req.params;

  try {
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check authorization - teacher must own this class
    if (classData.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const students = await Student.getByClass(classId);
    const stats = await Class.getStatsToday(classId);

    res.json({
      ...classData,
      students,
      stats,
    });
  } catch (err) {
    console.error('Get class error:', err);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

module.exports = router;
