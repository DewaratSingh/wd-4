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
        console.log('Starting Department & Escalation Migration...');

        // Step 1: Add columns
        console.log('Step 1: Adding columns...');
        await pool.query(`
            ALTER TABLE complaints 
            ADD COLUMN IF NOT EXISTS category VARCHAR(100),
            ADD COLUMN IF NOT EXISTS department VARCHAR(100),
            ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS is_escalated BOOLEAN DEFAULT FALSE;
        `);
        console.log('✓ Columns added');

        // Step 2: Seed categories and departments based on notes (optional but good for demo)
        console.log('Step 2: Seeding categories for existing data...');
        await pool.query(`
            UPDATE complaints SET category = 'Pothole', department = 'Road Maintenance' WHERE notes ILIKE '%pothole%' OR notes ILIKE '%road%';
            UPDATE complaints SET category = 'Waste', department = 'Garbage Collection' WHERE notes ILIKE '%garbage%' OR notes ILIKE '%waste%';
            UPDATE complaints SET category = 'Drainage', department = 'Water & Sewerage' WHERE notes ILIKE '%drain%' OR notes ILIKE '%flood%';
            UPDATE complaints SET category = 'Lighting', department = 'Electrical Dept' WHERE notes ILIKE '%light%' OR notes ILIKE '%dark%';
            UPDATE complaints SET category = 'Other', department = 'General Admin' WHERE category IS NULL;
        `);
        console.log('✓ Seeding completed');

        console.log('\n✅ WD-04 schema migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
