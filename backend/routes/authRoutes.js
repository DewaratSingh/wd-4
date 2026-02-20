import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password, municipal_name, latitude, longitude, radius } = req.body;

    if (!name || !email || !password || !latitude || !longitude || !radius) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO municipalities (name, email, password, municipal_name, latitude, longitude, radius)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, email, municipal_name, latitude, longitude, radius`,
            [name, email, password, municipal_name, latitude, longitude, radius]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("Signup error:", err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT id, name, email, municipal_name, latitude, longitude, radius FROM municipalities WHERE email = $1 AND password = $2`,
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
