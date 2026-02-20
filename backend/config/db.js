import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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
                upvotes INT DEFAULT 0,
                priority_score DECIMAL(5,2) DEFAULT 0,
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
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_image_url') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_image_url TEXT;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_latitude') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_latitude DECIMAL(10, 8);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='resolved_longitude') THEN
                    ALTER TABLE complaints ADD COLUMN resolved_longitude DECIMAL(11, 8);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='upvotes') THEN
                    ALTER TABLE complaints ADD COLUMN upvotes INT DEFAULT 0;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='priority_score') THEN
                    ALTER TABLE complaints ADD COLUMN priority_score DECIMAL(5,2) DEFAULT 0;
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

export { pool, initDb };
