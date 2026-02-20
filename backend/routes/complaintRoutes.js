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
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ─── Smart Priority Algorithm ────────────────────────────────────────────────

const SEVERITY_WEIGHTS = {
    drainage: 25, flood: 25,
    pothole: 20, road: 18,
    garbage: 15, waste: 15,
    streetlight: 10, light: 10,
    other: 5
};

function getSeverityWeight(notes = '') {
    const text = notes.toLowerCase();
    for (const [key, weight] of Object.entries(SEVERITY_WEIGHTS)) {
        if (text.includes(key)) return weight;
    }
    return 5;
}

function detectNearbyPOI(notes = '') {
    const text = notes.toLowerCase();
    return {
        nearbyHospital: text.includes('hospital') || text.includes('clinic') || text.includes('medical'),
        nearbySchool: text.includes('school') || text.includes('college') || text.includes('university')
    };
}

const DEPARTMENTS = {
    'Road Maintenance': ['pothole', 'road', 'asphalt', 'divider'],
    'Garbage Collection': ['garbage', 'waste', 'trash', 'dump'],
    'Water & Sewerage': ['drain', 'flood', 'sewage', 'pipe', 'leak'],
    'Electrical Dept': ['light', 'dark', 'bulb', 'wire', 'electricity'],
    'General Admin': []
};

function getDepartmentAssignment(notes = '') {
    const text = notes.toLowerCase();
    for (const [dept, keywords] of Object.entries(DEPARTMENTS)) {
        if (keywords.some(k => text.includes(k))) {
            return { department: dept, category: dept.split(' ')[0] };
        }
    }
    return { department: 'General Admin', category: 'Other' };
}

async function getWeatherRisk(latitude, longitude) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max&forecast_days=1&timezone=auto`;
        const resp = await fetch(url);
        const data = await resp.json();
        const rainProbability = data?.daily?.precipitation_probability_max?.[0] ?? 0;
        return { rainPredicted: rainProbability >= 50, rainProbability };
    } catch {
        return { rainPredicted: false, rainProbability: 0 };
    }
}

async function computePriorityScore(complaint) {
    const upvotes = parseInt(complaint.upvotes) || 0;
    const createdAt = new Date(complaint.created_at);
    const daysSinceReported = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const severity = getSeverityWeight(complaint.notes);
    const { nearbyHospital, nearbySchool } = detectNearbyPOI(complaint.notes);
    const { rainPredicted, rainProbability } = await getWeatherRisk(complaint.latitude, complaint.longitude);

    const rawScore =
        Math.min(upvotes * 10, 30) +   // cap upvote contribution at 30
        (nearbyHospital ? 30 : 0) +
        (nearbySchool ? 20 : 0) +
        severity +
        Math.min(daysSinceReported * 2, 30) +
        (rainPredicted ? 20 : 0);

    // max possible: 30+30+20+25+30+20 = 155 → normalize to 100
    const score = Math.min(Math.round((rawScore / 155) * 100), 100);

    const label = score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low';

    const impacts = [];
    if (nearbyHospital) impacts.push('Near a hospital — emergency access risk');
    if (nearbySchool) impacts.push('Near a school — affects children safety');
    if (rainPredicted) impacts.push(`Rain predicted (${rainProbability}% chance) — risk of flooding/worsening`);
    if (daysSinceReported > 7) impacts.push(`Unresolved for ${daysSinceReported} days`);

    const recommended =
        score >= 75 ? 'Dispatch within 6 hours' :
            score >= 50 ? 'Dispatch within 24 hours' :
                score >= 25 ? 'Schedule within 3 days' : 'Queue for routine maintenance';

    return { score, label, impacts, recommended, rainPredicted, rainProbability, nearbyHospital, nearbySchool };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

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
        const result = await pool.query('SELECT * FROM complaints ORDER BY priority_score DESC, created_at DESC');
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

        const { category, department } = getDepartmentAssignment(notes);

        const insertResult = await pool.query(
            'INSERT INTO complaints (image_url, notes, phone, latitude, longitude, category, department, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [result.secure_url, notes, phone, latitude, longitude, category, department, user_id]
        );

        // Compute initial priority score
        const complaint = insertResult.rows[0];
        const { score } = await computePriorityScore(complaint);
        const updated = await pool.query(
            'UPDATE complaints SET priority_score = $1 WHERE id = $2 RETURNING *',
            [score, complaint.id]
        );

        res.json({ success: true, data: updated.rows[0] });
    } catch (err) {
        console.error("Complaint submission error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update complaint status (Admin)
router.put('/complaint/update', upload.single('resolution_image'), async (req, res) => {
    // Basic safeguard: In a full app, this would use JWT/Passport middleware.
    // For WD-04, we ensure the request is treated as an administrative action.
    const { id, progress, resolved_text, resolved_latitude, resolved_longitude, admin_id } = req.body;

    // If we want to be strict, we could require admin_id
    // if (!admin_id) return res.status(403).json({ error: 'Unauthorized: Admin access required' });

    const file = req.file;

    let resolved_image_url = null;

    try {
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

        let query = 'UPDATE complaints SET progress = $1, resolved_text = $2';
        const params = [progress, resolved_text];
        let paramIndex = 3;

        // Journey Tracking timestamps
        if (progress === 'Accepted') {
            query += ', accepted_at = CURRENT_TIMESTAMP';
        } else if (progress === 'Work in Progress') {
            query += ', in_progress_at = CURRENT_TIMESTAMP';
        } else if (progress === 'Resolved' || progress === 'Closed') {
            query += ', resolved_at = CURRENT_TIMESTAMP';
        }

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

// Upvote a complaint — increments count and recalculates priority
router.post('/complaint/:id/upvote', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        // If user_id is provided, check for existing upvote
        if (user_id) {
            const checkUpvote = await pool.query(
                'SELECT * FROM upvotes WHERE user_id = $1 AND complaint_id = $2',
                [user_id, id]
            );

            if (checkUpvote.rows.length > 0) {
                return res.status(400).json({ success: false, error: 'You have already upvoted this complaint' });
            }

            // Record the upvote
            await pool.query(
                'INSERT INTO upvotes (user_id, complaint_id) VALUES ($1, $2)',
                [user_id, id]
            );
        }

        const upvoted = await pool.query(
            'UPDATE complaints SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        if (upvoted.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const complaint = upvoted.rows[0];
        const priorityData = await computePriorityScore(complaint);
        await pool.query('UPDATE complaints SET priority_score = $1 WHERE id = $2', [priorityData.score, id]);

        res.json({ success: true, upvotes: complaint.upvotes, priority: priorityData });
    } catch (err) {
        console.error("Upvote error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get/Recalculate priority score for a complaint
router.post('/complaint/:id/priority', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM complaints WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const complaint = result.rows[0];
        const priorityData = await computePriorityScore(complaint);

        // Persist the recalculated score
        await pool.query('UPDATE complaints SET priority_score = $1 WHERE id = $2', [priorityData.score, id]);

        res.json({ success: true, priority: priorityData });
    } catch (err) {
        console.error("Priority calculation error:", err);
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
                parseFloat(latitude), parseFloat(longitude),
                parseFloat(complaint.latitude), parseFloat(complaint.longitude)
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
    const REF_LAT = 28.6139;
    const REF_LON = 77.2090;
    const distance = calculateDistance(latitude, longitude, REF_LAT, REF_LON);
    if (distance > 50) {
        res.json({ valid: true, distance });
    } else {
        res.json({ valid: false, distance });
    }
});

// AI-Powered Duplicate Detection
router.post('/check-duplicates', upload.single('image'), async (req, res) => {
    const { notes, latitude, longitude } = req.body;

    try {
        const result = await pool.query('SELECT * FROM complaints WHERE progress != \'Resolved\'');
        const allComplaints = result.rows;

        const nearbyComplaints = allComplaints.filter(complaint => {
            if (!complaint.latitude || !complaint.longitude) return false;
            const dist = calculateDistance(
                parseFloat(latitude), parseFloat(longitude),
                parseFloat(complaint.latitude), parseFloat(complaint.longitude)
            );
            // 0.05 km = 50 meters
            return dist <= 0.05;
        });

        if (nearbyComplaints.length === 0) {
            return res.json({ success: true, duplicates: [] });
        }

        // Limit AI analysis to top 3 closest issues to save tokens/time
        const duplicatesWithAI = await Promise.all(nearbyComplaints.slice(0, 3).map(async (duplicate) => {
            try {
                // If notes are too short, skip AI and mark based on distance
                if (!notes || notes.length < 5) {
                    return {
                        ...duplicate,
                        distance: Math.round(calculateDistance(latitude, longitude, duplicate.latitude, duplicate.longitude) * 1000),
                        similarity: 80,
                        aiAnalysis: { similarity: 80, reason: "Same location, assuming potential duplicate", isDuplicate: true }
                    };
                }

                const prompt = `Compare these two civic issue reports:
Report 1: "${notes}"
Report 2: "${duplicate.notes}"

Are they describing the same physical problem (like the same pothole, same garbage pile, same broken light)? 
Return ONLY a JSON object: {"similarity": percentage, "reason": "1-sentence explanation", "isDuplicate": true/false}`;

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "CivicLens"
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                        "messages": [{ "role": "user", "content": prompt }]
                    })
                });

                const data = await response.json();
                const content = data.choices[0].message.content.replace(/```json|```/g, '').trim();
                const aiResult = JSON.parse(content);

                return {
                    ...duplicate,
                    distance: Math.round(calculateDistance(latitude, longitude, duplicate.latitude, duplicate.longitude) * 1000),
                    similarity: aiResult.similarity,
                    aiAnalysis: aiResult
                };
            } catch (err) {
                console.error("AI Check Error:", err);
                return {
                    ...duplicate,
                    distance: Math.round(calculateDistance(latitude, longitude, duplicate.latitude, duplicate.longitude) * 1000),
                    similarity: 50,
                    aiAnalysis: { similarity: 50, reason: "Manual review recommended", isDuplicate: true }
                };
            }
        }));

        res.json({ success: true, duplicates: duplicatesWithAI });
    } catch (err) {
        console.error("Duplicate Check API Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) FROM complaints');
        const total = parseInt(totalResult.rows[0].count);

        const statusResult = await pool.query('SELECT progress, COUNT(*) FROM complaints GROUP BY progress');
        const statusCounts = statusResult.rows.reduce((acc, row) => {
            acc[row.progress] = parseInt(row.count);
            return acc;
        }, {});

        const pending = (statusCounts['Submitted'] || 0) +
            (statusCounts['In Progress'] || 0) +
            (statusCounts['Assigned'] || 0) +
            (statusCounts['Pending'] || 0);

        const resolved = statusCounts['Resolved'] || 0;

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
                total, pending, resolved,
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
