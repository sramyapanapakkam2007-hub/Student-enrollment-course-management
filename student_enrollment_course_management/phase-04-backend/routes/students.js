import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM students ORDER BY id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  try {
    const { roll_no, name, email, phone, department, year_level } = req.body;
    if (!roll_no || !name || !email) return res.status(400).json({ message: 'roll_no, name and email are required' });

    const [result] = await pool.query(
      `INSERT INTO students (roll_no, name, email, phone, department, year_level)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roll_no, name, email, phone || null, department || null, year_level || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Student created' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { roll_no, name, email, phone, department, year_level } = req.body;
    await pool.query(
      `UPDATE students SET roll_no=?, name=?, email=?, phone=?, department=?, year_level=? WHERE id=?`,
      [roll_no, name, email, phone || null, department || null, year_level || null, req.params.id]
    );
    res.json({ message: 'Student updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ message: 'Student deleted' });
});

export default router;
