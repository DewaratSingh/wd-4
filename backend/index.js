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

const TARGET_LAT = 19.048731;
const TARGET_LON = 72.910758;

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Add columns if they don't exist (for existing tables)
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

// ... (Authentication Endpoints remain) ...
// --- User Authentication Endpoints ---

app.post('/api/user/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [username, email, password]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("User signup error:", err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query(
            `SELECT id, username, email FROM users WHERE email = $1 AND password = $2`,
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error("User login error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// INSERT NEW ENDPOINTS HERE

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

app.get('/api/complaint/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM complaints WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error("Get complaint error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/complaint/update', async (req, res) => {
    const { id, progress, resolved_text } = req.body;
    try {
        const result = await pool.query(
            'UPDATE complaints SET progress = $1, resolved_text = $2 WHERE id = $3 RETURNING *',
            [progress, resolved_text, id]
        );
        res.json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error("Update complaint error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
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

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

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
        const allComplaints = result.rows;

        const filteredComplaints = allComplaints.filter(complaint => {
            if (!complaint.latitude || !complaint.longitude) return false;

            const dist = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(complaint.latitude),
                parseFloat(complaint.longitude)
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

// --- Authentication Endpoints ---

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
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
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

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

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
        const allComplaints = result.rows;

        const filteredComplaints = allComplaints.filter(complaint => {
            if (!complaint.latitude || !complaint.longitude) return false;

            const dist = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(complaint.latitude),
                parseFloat(complaint.longitude)
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
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });

        const imageUrl = result.secure_url;

        // Save to Database
        const insertQuery = `
            INSERT INTO complaints (image_url, notes, phone, latitude, longitude, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const dbResult = await pool.query(insertQuery, [imageUrl, notes, phone, latitude, longitude, user_id]);

        res.json({ success: true, data: dbResult.rows[0] });

    } catch (error) {
        console.error('Error processing complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
