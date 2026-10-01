import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.id, e.enrolled_at,
           s.roll_no, s.name AS student_name,
           c.code, c.name AS course_name
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    JOIN courses c ON c.id = e.course_id
    ORDER BY e.id DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { student_id, course_id } = req.body;
    await connection.beginTransaction();

    const [courseRows] = await connection.query(
      'SELECT capacity FROM courses WHERE id=? FOR UPDATE', [course_id]
    );
    if (!courseRows.length) return res.status(404).json({ message: 'Course not found' });

    const [countRows] = await connection.query(
      'SELECT COUNT(*) AS count FROM enrollments WHERE course_id=?', [course_id]
    );
    if (countRows[0].count >= courseRows[0].capacity) {
      await connection.rollback();
      return res.status(409).json({ message: 'Course capacity is full' });
    }

    await connection.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );

    await connection.commit();
    res.status(201).json({ message: 'Enrollment created' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM enrollments WHERE id=?', [req.params.id]);
  res.json({ message: 'Enrollment deleted' });
});

export default router;
