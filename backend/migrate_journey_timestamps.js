import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Starting migration: Adding journey timestamps...");

        await pool.query(`
            ALTER TABLE complaints 
            ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS in_progress_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;
        `);

        console.log("Migration successful: Columns added.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();
