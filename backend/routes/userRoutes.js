import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// POST /api/user/signup
router.post('/user/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email and password are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email, created_at`,
            [username, email, password]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('User signup error:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/user/login
router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query(
            `SELECT id, username, email, created_at FROM users WHERE email = $1 AND password = $2`,
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('User login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
