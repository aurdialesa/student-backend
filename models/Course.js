const pool = require('../config/database');

class Course {
  static async create(courseData) {
    const { course_code, course_name, credits, department, description } = courseData;

    const query = `
      INSERT INTO courses (course_code, course_name, credits, department, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [course_code, course_name, credits, department, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM courses WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.department) {
      query += ` AND department = $${paramCount}`;
      values.push(filters.department);
      paramCount++;
    }

    query += ' ORDER BY course_code ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, courseData) {
    const { course_name, credits, department, description } = courseData;

    const query = `
      UPDATE courses SET
        course_name = $1, credits = $2, department = $3, description = $4
      WHERE id = $5
      RETURNING *
    `;

    const values = [course_name, credits, department, description, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getEnrolledStudents(courseId) {
    const query = `
      SELECT 
        s.id, s.student_id, s.first_name, s.last_name, s.email,
        e.semester, e.year, e.grade, e.enrollment_date
      FROM students s
      INNER JOIN enrollments e ON s.id = e.student_id
      WHERE e.course_id = $1
      ORDER BY s.last_name, s.first_name
    `;

    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async getStatistics() {
    const query = `
      SELECT
        COUNT(*) as total_courses,
        COUNT(DISTINCT department) as total_departments,
        AVG(credits) as avg_credits,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments
      FROM courses
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Course;