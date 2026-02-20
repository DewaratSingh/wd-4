import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api', authRoutes);
app.use('/api', complaintRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
