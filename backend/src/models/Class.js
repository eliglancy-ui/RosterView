// Class model
const pool = require('../config/database');

class Class {
  // Find class by id
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, teacher_id, name, grade_level, period, school_year, description FROM classes WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Get all classes for a teacher
  static async getByTeacher(teacherId) {
    const result = await pool.query(
      'SELECT id, name, grade_level, period, school_year, description FROM classes WHERE teacher_id = $1 ORDER BY period',
      [teacherId]
    );
    return result.rows;
  }

  // Get every class (admin view)
  static async getAll() {
    const result = await pool.query(
      'SELECT id, name, grade_level, period, school_year, description FROM classes ORDER BY period'
    );
    return result.rows;
  }

  // Create a new class
  static async create(teacherId, name, gradeLavel, period, schoolYear, description = '') {
    const result = await pool.query(
      'INSERT INTO classes (teacher_id, name, grade_level, period, school_year, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [teacherId, name, gradeLavel, period, schoolYear, description]
    );
    return result.rows[0];
  }

  // Get enrollment count
  static async getEnrollmentCount(classId) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM enrollments WHERE class_id = $1',
      [classId]
    );
    return result.rows[0].count;
  }

  // Get class statistics for today
  static async getStatsToday(classId) {
    const result = await pool.query(
      `SELECT
        COUNT(DISTINCT ss.student_id) as total_students,
        COUNT(CASE WHEN ss.status = 'school' THEN 1 END) as at_school,
        COUNT(CASE WHEN ss.status = 'home' THEN 1 END) as at_home,
        COUNT(CASE WHEN ss.status = 'iss' THEN 1 END) as in_iss
       FROM enrollments e
       LEFT JOIN student_status ss ON e.student_id = ss.student_id AND ss.class_id = $1 AND ss.status_date = CURRENT_DATE
       WHERE e.class_id = $1`,
      [classId]
    );
    return result.rows[0];
  }
}

module.exports = Class;
