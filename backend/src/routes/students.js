// Student routes
const express = require('express');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { verifyToken, requireTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Update student status
router.put('/:studentId/status', verifyToken, requireTeacherOrAdmin, async (req, res) => {
  const { studentId } = req.params;
  const { classId, status, notes } = req.body;

  if (!classId || !status) {
    return res.status(400).json({ error: 'Class ID and status required' });
  }

  if (!['school', 'home', 'iss'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be school, home, or iss' });
  }

  try {
    // Verify teacher owns this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classData.teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Update status
    const updatedStatus = await Student.updateStatus(
      studentId,
      classId,
      status,
      notes,
      req.user.id
    );

    res.json({
      success: true,
      status: updatedStatus,
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get student details
router.get('/:studentId', verifyToken, async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get current ISS status if any
    const issStatus = await Student.getISSStatus(studentId);

    res.json({
      ...student,
      issStatus,
    });
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

module.exports = router;
