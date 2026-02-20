import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pg from 'pg';
const { Pool } = pg;
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Initialize Database Tables
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaints (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                notes TEXT,
                phone VARCHAR(20),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                progress VARCHAR(50) DEFAULT 'Pending',
                resolved_text TEXT,
                resolved_image_url TEXT,
                resolved_latitude DECIMAL(10, 8),
                resolved_longitude DECIMAL(11, 8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='progress') THEN
                    ALTER TABLE complaints ADD COLUMN progress VARCHAR(50) DEFAULT 'Pending';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_text') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_text TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='user_id') THEN
                    ALTER TABLE complaints ADD COLUMN user_id INTEGER;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_image_url') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_image_url TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_latitude') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_latitude DECIMAL(10, 8);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_longitude') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_longitude DECIMAL(11, 8);
                END IF;
            END$$;

            CREATE TABLE IF NOT EXISTS municipalities (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                municipal_name VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                radius DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database initialized");
    } catch (err) {
        console.error("Error initializing database", err);
    }
};

initDb();

// --- User (Citizen) Authentication Endpoints ---

app.post('/api/user/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
            [username, email, password]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("User signup error:", err);
        if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    try {
        const result = await pool.query(
            `SELECT id, username, email FROM users WHERE email = $1 AND password = $2`,
            [email, password]
        );
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("User login error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user-complaints/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json({ success: true, complaints: result.rows });
    } catch (err) {
        console.error("Get user complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Municipality (Admin) Authentication Endpoints ---

app.post('/api/signup', async (req, res) => {
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
        if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            `SELECT id, name, email, municipal_name, latitude, longitude, radius FROM municipalities WHERE email = $1 AND password = $2`,
            [email, password]
        );
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/my-complaints', async (req, res) => {
    const { latitude, longitude, radius } = req.body;
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ error: 'Location and radius required' });
    }
    try {
        const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
        const filteredComplaints = result.rows.filter(complaint => {
            if (!complaint.latitude || !complaint.longitude) return false;
            const dist = calculateDistance(
                parseFloat(latitude), parseFloat(longitude),
                parseFloat(complaint.latitude), parseFloat(complaint.longitude)
            );
            complaint.distanceFromMuni = dist;
            return dist <= parseFloat(radius);
        });
        res.json({ success: true, complaints: filteredComplaints });
    } catch (err) {
        console.error("Fetch complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Complaint Endpoints ---

app.post('/api/complaint', upload.single('image'), async (req, res) => {
    const { notes, phone, latitude, longitude, user_id } = req.body;
    const file = req.file;
    if (!file || !latitude || !longitude) {
        return res.status(400).json({ error: 'Image and location are required' });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'complaints' },
                (error, result) => { if (error) reject(error); else resolve(result); }
            );
            uploadStream.end(file.buffer);
        });
        const imageUrl = result.secure_url;
        const dbResult = await pool.query(
            `INSERT INTO complaints (image_url, notes, phone, latitude, longitude, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [imageUrl, notes, phone, latitude, longitude, user_id]
        );
        res.json({ success: true, data: dbResult.rows[0] });
    } catch (error) {
        console.error('Error processing complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/complaint/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM complaints WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Complaint not found' });
        res.json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error("Get complaint error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/complaint/update', upload.single('resolution_image'), async (req, res) => {
    const { id, progress, resolved_text, resolved_latitude, resolved_longitude } = req.body;
    const file = req.file;

    try {
        let resolved_image_url = null;

        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'resolutions' },
                    (error, result) => { if (error) reject(error); else resolve(result); }
                );
                uploadStream.end(file.buffer);
            });
            resolved_image_url = result.secure_url;
        }

        let query, params;
        if (resolved_image_url) {
            query = `UPDATE complaints SET progress = $1, resolved_text = $2, resolved_image_url = $3, resolved_latitude = $4, resolved_longitude = $5 WHERE id = $6 RETURNING *`;
            params = [progress, resolved_text, resolved_image_url, resolved_latitude, resolved_longitude, id];
        } else {
            query = `UPDATE complaints SET progress = $1, resolved_text = $2 WHERE id = $3 RETURNING *`;
            params = [progress, resolved_text, id];
        }

        const result = await pool.query(query, params);
        res.json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error("Update complaint error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/all-complaints', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
        res.json({ success: true, complaints: result.rows });
    } catch (err) {
        console.error("Get all complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) as total FROM complaints');
        const statusResult = await pool.query(`
            SELECT progress, COUNT(*) as count
            FROM complaints
            GROUP BY progress
        `);
        const trendResult = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM complaints
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);
        const categoryResult = await pool.query(`
            SELECT 'General' as category, COUNT(*) as count FROM complaints
        `);

        const statusCounts = {};
        statusResult.rows.forEach(row => {
            statusCounts[row.progress || 'Pending'] = parseInt(row.count);
        });

        res.json({
            success: true,
            stats: {
                total: parseInt(totalResult.rows[0].total),
                statusCounts,
                trend: trendResult.rows,
                categories: categoryResult.rows
            }
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/map-complaints', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, latitude, longitude, progress, notes, created_at FROM complaints WHERE latitude IS NOT NULL AND longitude IS NOT NULL'
        );
        res.json({ success: true, complaints: result.rows });
    } catch (err) {
        console.error("Map complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
