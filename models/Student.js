const pool = require('../config/database');

class Student {
  static async create(studentData) {
    const {
      student_id, first_name, last_name, email, phone,
      date_of_birth, gender, address, department, program,
      year_of_study, enrollment_date
    } = studentData;

    const query = `
      INSERT INTO students (
        student_id, first_name, last_name, email, phone,
        date_of_birth, gender, address, department, program,
        year_of_study, enrollment_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      student_id, first_name, last_name, email, phone,
      date_of_birth, gender, address, department, program,
      year_of_study, enrollment_date
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM students WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.department) {
      query += ` AND department = $${paramCount}`;
      values.push(filters.department);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, studentData) {
    const {
      first_name, last_name, email, phone, date_of_birth,
      gender, address, department, program, year_of_study, status
    } = studentData;

    const query = `
      UPDATE students SET
        first_name = $1, last_name = $2, email = $3, phone = $4,
        date_of_birth = $5, gender = $6, address = $7,
        department = $8, program = $9, year_of_study = $10,
        status = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      first_name, last_name, email, phone, date_of_birth,
      gender, address, department, program, year_of_study,
      status, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM students WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_students,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students,
        COUNT(DISTINCT department) as total_departments,
        AVG(year_of_study) as avg_year_of_study
      FROM students
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Student;