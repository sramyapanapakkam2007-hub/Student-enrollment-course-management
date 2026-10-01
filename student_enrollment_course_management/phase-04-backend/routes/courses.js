import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM courses ORDER BY id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  try {
    const { code, name, description, credits, capacity } = req.body;
    if (!code || !name) return res.status(400).json({ message: 'code and name are required' });

    const [result] = await pool.query(
      `INSERT INTO courses (code, name, description, credits, capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [code, name, description || null, credits || 3, capacity || 30]
    );
    res.status(201).json({ id: result.insertId, message: 'Course created' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { code, name, description, credits, capacity } = req.body;
    await pool.query(
      `UPDATE courses SET code=?, name=?, description=?, credits=?, capacity=? WHERE id=?`,
      [code, name, description || null, credits || 3, capacity || 30, req.params.id]
    );
    res.json({ message: 'Course updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
  res.json({ message: 'Course deleted' });
});

export default router;
