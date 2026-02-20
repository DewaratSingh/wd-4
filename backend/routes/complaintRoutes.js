import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { pool } from '../config/db.js';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Routes

// Get single complaint
router.get('/complaint/:id', async (req, res) => {
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

// Get all complaints (unfiltered)
router.get('/all-complaints', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
        res.json({ success: true, complaints: result.rows });
    } catch (err) {
        console.error("Get all complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get complaints for a specific user
router.get('/user-complaints/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json({ success: true, complaints: result.rows });
    } catch (err) {
        console.error("Get user-complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit a new complaint
router.post('/complaint', upload.single('image'), async (req, res) => {
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

        const insertResult = await pool.query(
            'INSERT INTO complaints (image_url, notes, phone, latitude, longitude, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [result.secure_url, notes, phone, latitude, longitude, user_id]
        );

        res.json({ success: true, data: insertResult.rows[0] });
    } catch (err) {
        console.error("Complaint submission error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update complaint status
router.put('/complaint/update', upload.single('resolution_image'), async (req, res) => {
    const { id, progress, resolved_text, resolved_latitude, resolved_longitude } = req.body;
    const file = req.file;

    let resolved_image_url = null;

    try {
        // Upload resolution image if present
        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'resolutions' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(file.buffer);
            });
            resolved_image_url = result.secure_url;
        }

        // Build dynamic update query
        let query = 'UPDATE complaints SET progress = $1, resolved_text = $2';
        const params = [progress, resolved_text];
        let paramIndex = 3;

        if (resolved_image_url) {
            query += `, resolved_image_url = $${paramIndex}`;
            params.push(resolved_image_url);
            paramIndex++;
        }

        if (resolved_latitude) {
            query += `, resolved_latitude = $${paramIndex}`;
            params.push(resolved_latitude);
            paramIndex++;
        }

        if (resolved_longitude) {
            query += `, resolved_longitude = $${paramIndex}`;
            params.push(resolved_longitude);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} RETURNING *`;
        params.push(id);

        const result = await pool.query(query, params);
        res.json({ success: true, complaint: result.rows[0] });

    } catch (err) {
        console.error("Update complaint error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get complaints by radius (My Complaints)
router.post('/my-complaints', async (req, res) => {
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
            return dist <= parseFloat(radius);
        });

        res.json({ success: true, complaints: filteredComplaints });
    } catch (err) {
        console.error("Get my-complaints error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check location validity
router.post('/check-location', (req, res) => {
    const { latitude, longitude } = req.body;

    // Example reference point (e.g., City Center)
    const REF_LAT = 28.6139;
    const REF_LON = 77.2090;

    const distance = calculateDistance(latitude, longitude, REF_LAT, REF_LON);

    // Ensure user is FAR from this point (> 50km) - Logic as per original req
    // Or maybe user meant "within" range? Original prompt said "verify distance > 50km" which is unusual but sticking to it.
    // Wait, original prompt context in previous logs said "verify location's distance from a reference point". 
    // Let's assume the previous logic was correct.

    // Actually, looking at previous code, it wasn't fully implemented or was commented out. 
    // I'll re-implement the helper here just in case it's used.

    if (distance > 50) {
        res.json({ valid: true, distance });
    } else {
        res.json({ valid: false, distance });
    }
});

// Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        // 1. Total Complaints
        const totalResult = await pool.query('SELECT COUNT(*) FROM complaints');
        const total = parseInt(totalResult.rows[0].count);

        // 2. Status Distribution
        const statusResult = await pool.query('SELECT progress, COUNT(*) FROM complaints GROUP BY progress');
        const statusCounts = statusResult.rows.reduce((acc, row) => {
            acc[row.progress] = parseInt(row.count);
            return acc;
        }, {});

        // 3. Pending (Submitted, In Progress, Assigned, Pending)
        // Note: 'Pending' is the default in DB, mapping it to 'Submitted' logic if needed, or just summing it up.
        const pending = (statusCounts['Submitted'] || 0) +
            (statusCounts['In Progress'] || 0) +
            (statusCounts['Assigned'] || 0) +
            (statusCounts['Pending'] || 0);

        // 4. Resolved Count
        const resolved = statusCounts['Resolved'] || 0;

        // 5. Trend (Last 7 days)
        const trendResult = await pool.query(`
            SELECT
                to_char(created_at, 'Mon DD') as date,
                COUNT(*) as total,
                SUM(CASE WHEN progress = 'Resolved' THEN 1 ELSE 0 END) as resolved
            FROM complaints
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY 1
            ORDER BY MIN(created_at)
        `);

        res.json({
            success: true,
            stats: {
                total,
                pending,
                resolved,
                statusCounts,
                trend: trendResult.rows
            }
        });

    } catch (err) {
        console.error("Get stats error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
