import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log('Starting Upvotes Migration...');

        // Step 1: Create upvotes table
        console.log('Step 1: Creating upvotes table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS upvotes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, complaint_id)
            );
        `);
        console.log('✓ upvotes table ready');

        // Step 2: Ensure complaints table has upvotes count column
        console.log('Step 2: Ensuring complaints.upvotes column exists...');
        await pool.query(`
            DO $
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='complaints' AND column_name='upvotes'
                ) THEN
                    ALTER TABLE complaints ADD COLUMN upvotes INTEGER DEFAULT 0;
                END IF;
            END$;
        `);
        console.log('✓ complaints.upvotes column ready');

        console.log('\n✅ Upvotes migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
