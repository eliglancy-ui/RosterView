// Teacher model
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Teacher {
  // Find teacher by email
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM teachers WHERE email = $1', [email]);
    return result.rows[0];
  }

  // Find teacher by id
  static async findById(id) {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, school_id, created_at FROM teachers WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new teacher
  static async create(email, password, firstName, lastName, role = 'teacher') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO teachers (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, hashedPassword, firstName, lastName, role]
    );
    return result.rows[0];
  }

  // Get teacher's classes
  static async getClasses(teacherId) {
    const result = await pool.query(
      'SELECT id, name, grade_level, period, school_year, description FROM classes WHERE teacher_id = $1 ORDER BY period',
      [teacherId]
    );
    return result.rows;
  }
}

module.exports = Teacher;
