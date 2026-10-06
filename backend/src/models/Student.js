// Student model
const pool = require('../config/database');

class Student {
  // Find student by id
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, student_id, date_of_birth, created_at FROM students WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Get all students in a class
  static async getByClass(classId) {
    const result = await pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.email, s.student_id,
              ss.status, ss.status_date, ss.notes
       FROM students s
       JOIN enrollments e ON s.id = e.student_id
       LEFT JOIN student_status ss ON s.id = ss.student_id AND ss.class_id = $1 AND ss.status_date = CURRENT_DATE
       WHERE e.class_id = $1
       ORDER BY s.last_name, s.first_name`,
      [classId]
    );
    return result.rows;
  }

  // Update student status for a class
  static async updateStatus(studentId, classId, status, notes = null, updatedBy = null) {
    const result = await pool.query(
      `INSERT INTO student_status (student_id, class_id, status, status_date, notes, updated_by)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)
       ON CONFLICT (student_id, class_id, status_date)
       DO UPDATE SET status = $3, notes = $4, updated_by = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING id, status, status_date, notes`,
      [studentId, classId, status, notes, updatedBy]
    );
    return result.rows[0];
  }

  // Get student status for today
  static async getStatusToday(studentId, classId) {
    const result = await pool.query(
      'SELECT id, status, notes FROM student_status WHERE student_id = $1 AND class_id = $2 AND status_date = CURRENT_DATE',
      [studentId, classId]
    );
    return result.rows[0];
  }

  // Get ISS status for student
  static async getISSStatus(studentId) {
    const result = await pool.query(
      `SELECT id, start_date, end_date, reason, status, notes
       FROM iss_records
       WHERE student_id = $1 AND status = 'active'
       ORDER BY start_date DESC
       LIMIT 1`,
      [studentId]
    );
    return result.rows[0];
  }
}

module.exports = Student;
