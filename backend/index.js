require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

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




app.post('/api/complaint', upload.single('image'), async (req, res) => {
    const { notes, phone, latitude, longitude } = req.body;
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
            INSERT INTO complaints (image_url, notes, phone, latitude, longitude)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const dbResult = await pool.query(insertQuery, [imageUrl, notes, phone, latitude, longitude]);

        res.json({ success: true, data: dbResult.rows[0] });

    } catch (error) {
        console.error('Error processing complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
